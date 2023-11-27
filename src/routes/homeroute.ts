import { Router, Request, Response, NextFunction } from "express";

import { VerifyToken } from "../middlewares/verifytoken";
import { DeleteUser } from "../controllers/authentication/deleteuser";

import { checkRequestBodyParams } from "../middlewares/authmiddleware";

import CreatePost from "../controllers/home/CreatePost";
import LikePost from "../controllers/home/Actions/LikePost";
import UnLikePost from "../controllers/home/Actions/UnlikePost";
import CommentOnPost from "../controllers/home/CommentOnPost";
import SinglePost from "../controllers/home/Singlepost";
import SavePostToProfile from "../controllers/home/SavePostToProfile";
import GetUsersPosts from "../controllers/home/GetAllUserPost";

class CustomUserProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.message = "CustomUserProfileError";
  }
}

const homerouter = Router();
//

homerouter.post(
  "/createpost",
  checkRequestBodyParams(["caption"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { mediaurl, caption } = req.body;
      const postinfo = { caption, mediaurl };
      const result = await CreatePost(uid, postinfo);

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
homerouter.post(
  "/likepost",
  checkRequestBodyParams(["postid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { postid } = req.body;
      const result = await LikePost(uid, postid);

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
homerouter.post(
  "/unlikepost",
  checkRequestBodyParams(["postid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { postid } = req.body;
      const result = await UnLikePost(uid, postid);

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
homerouter.post(
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
homerouter.post(
  "/singlepost",
  checkRequestBodyParams(["postid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { postid } = req.body;

      const result = await SinglePost(postid);

      res.status(200).json({ data: result });
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
homerouter.post(
  "/savetoprofile",
  checkRequestBodyParams(["postid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { postid } = req.body;

      const result = await SavePostToProfile(uid, postid);

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

homerouter.get("/posts", VerifyToken, async (req: Request, res: Response) => {
  try {
    const uid = (req as any).uid;

    const result = await GetUsersPosts(uid);

    res.status(200).json({ data: result });
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

homerouter.delete(
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
export default homerouter;
