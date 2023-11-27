import { Router, Request, Response, NextFunction } from "express";

import { VerifyToken } from "../middlewares/verifytoken";
import { DeleteUser } from "../controllers/authentication/deleteuser";
import GetUserProfileInformation from "../controllers/profile/getuserprofileinformation";
import UpdateUserProfileInformation from "../controllers/profile/updateuserinformation";
import { checkRequestBodyParams } from "../middlewares/authmiddleware";
import InitializeChat from "../direcmessages/InitializeChat";
import { GetConversationId } from "../direcmessages/GetConversationId";
import SendMessage from "../direcmessages/SendMessage";
import SeenMessage from "../direcmessages/SeenMessage";
import { FieldValue } from "firebase-admin/firestore";
import { getUserChatList } from "../direcmessages/GetUserChatList";

class CustomUserProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.message = "CustomUserProfileError";
  }
}

const dmrouter = Router();
//
dmrouter.post(
  "/initializechat",
  checkRequestBodyParams(["friendid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { friendid } = req.body;
      const result = await InitializeChat(uid, friendid);
      res.status(200).json({ message: result });
    } catch (err: any) {
      console.log(err);

      return res.json({ error: err });
    }
  }
);

dmrouter.post(
  "/sendDM",
  checkRequestBodyParams(["text", "friendid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;

      const { text, friendid, mediaurl, type = "text" } = req.body;
      const conversationid: any = await GetConversationId(uid, friendid);
      const message = {
        author: uid,
        reciever: friendid,
        text,
        mediaurl,
        type,
        sent: FieldValue.serverTimestamp(),
      };
      const result = await SendMessage(conversationid, message);
      res.status(200).json({ message: result });
    } catch (err: any) {
      if (err instanceof CustomUserProfileError) {
        return res.status(400).json({ error: err.message });
      } else if (err instanceof Error) {
        // Handle other specific errors as needed
        return res.status(500).json({ error: err });
      }

      return res.json({ error: err });
    }
  }
);
dmrouter.post(
  "/conversationid",
  checkRequestBodyParams(["friendid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { friendid } = req.body;
      const result = await GetConversationId(uid, friendid);
      res.status(200).json({ message: result });
    } catch (err: any) {
      if (err instanceof CustomUserProfileError) {
        return res.status(400).json({ error: err.message });
      } else if (err instanceof Error) {
        // Handle other specific errors as needed
        return res.status(500).json({ error: err });
      }

      return res.json({ error: err });
    }
  }
);
dmrouter.post(
  "/seenDM",
  checkRequestBodyParams(["conversationid", "messageid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { conversationid, messageid } = req.body;
      const result = await SeenMessage(uid, conversationid, messageid);
      res.status(200).json({ message: result });
    } catch (err: any) {
      if (err instanceof CustomUserProfileError) {
        return res.status(400).json({ error: err.message });
      } else if (err instanceof Error) {
        // Handle other specific errors as needed
        return res.status(500).json({ error: err });
      }

      return res.json({ error: err });
    }
  }
);
dmrouter.get("/chatlist", VerifyToken, async (req: Request, res: Response) => {
  try {
    const uid = (req as any).uid;
    const result = await getUserChatList(uid);
    res.status(200).json({ chats: result });
  } catch (err: any) {
    if (err instanceof CustomUserProfileError) {
      return res.status(400).json({ error: err.message });
    } else if (err instanceof Error) {
      // Handle other specific errors as needed
      return res.status(500).json({ error: err });
    }

    return res.json({ error: err });
  }
});
dmrouter.delete(
  "/deleteuser",
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const result = await DeleteUser(uid);

      res.status(200).json({ message: result });
    } catch (err: any) {
      throw new Error("Error with deleting user");
    }
  }
);
export default dmrouter;
