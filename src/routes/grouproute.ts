import { Router, Request, Response, NextFunction } from "express";

import { VerifyToken } from "../middlewares/verifytoken";
import { DeleteUser } from "../controllers/authentication/deleteuser";
import GetUserProfileInformation from "../controllers/profile/getuserprofileinformation";
import UpdateUserProfileInformation from "../controllers/profile/updateuserinformation";
import GetUsersGroup from "../controllers/groups/getusersgroup";
import CreateGroup from "../controllers/groups/CreateGroup";
import { checkRequestBodyParams } from "../middlewares/authmiddleware";
import SendMessageToGroup from "../controllers/groups/messaging/SendMessage";
import JoinGroup from "../controllers/groups/JoinGroup";
import IsUserInGroup from "../controllers/groups/IsUserInGroup";
import CreateGroupPost from "../controllers/groups/posts/CreatePost";
import UnLikeGroupPost from "../controllers/groups/posts/Actions/UnlikePost";
import CommentOnPost from "../controllers/groups/posts/CommentOnPost";
import LikeGroupPost from "../controllers/groups/posts/Actions/LikePost";

class CustomUserProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.message = "CustomUserProfileError";
  }
}

const grouprouter = Router();
//
grouprouter.get(
  "/mygroups",
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const result = await GetUsersGroup(uid);

      res.status(200).json({ groups: result });
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

grouprouter.post(
  "/creategroup",
  checkRequestBodyParams(["name", "description", "photourl"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { name, photourl, description } = req.body;
      const groupInfo = { name, photourl, description, admin: uid };
      const result = await CreateGroup(uid, groupInfo);

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
grouprouter.post(
  "/message",
  checkRequestBodyParams(["message", "groupid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { message, groupid } = req.body;
      const result = await SendMessageToGroup(uid, groupid, message);

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
grouprouter.post(
  "/joingroup",
  checkRequestBodyParams(["groupid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { groupid } = req.body;
      const result = await JoinGroup(uid, groupid);

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
grouprouter.post(
  "/isuseringroup",
  checkRequestBodyParams(["groupid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { groupid } = req.body;
      const result = await IsUserInGroup(uid, groupid);

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
grouprouter.post(
  "/createpost",
  checkRequestBodyParams(["groupid", "caption"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { groupid, mediaurl, caption } = req.body;
      const postinfo = { caption, mediaurl };
      const result = await CreateGroupPost(uid, groupid, postinfo);

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
grouprouter.post(
  "/likepost",
  checkRequestBodyParams(["postid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { postid } = req.body;
      const result = await LikeGroupPost(uid, postid);

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
grouprouter.post(
  "/unlikepost",
  checkRequestBodyParams(["postid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { postid } = req.body;
      const result = await UnLikeGroupPost(uid, postid);

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
grouprouter.post(
  "/commentonpost",
  checkRequestBodyParams(["postid", "comment"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { comment, postid } = req.body;

      const result = await CommentOnPost(uid, comment, postid);

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
grouprouter.delete(
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
export default grouprouter;
