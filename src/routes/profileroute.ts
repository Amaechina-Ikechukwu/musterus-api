import { Router, Request, Response, NextFunction } from "express";

import { VerifyToken } from "../middlewares/verifytoken";
import { DeleteUser } from "../controllers/authentication/deleteuser";
import GetUserProfileInformation from "../controllers/profile/getuserprofileinformation";
import UpdateUserProfileInformation from "../controllers/profile/updateuserinformation";
import FollowUser from "../controllers/profile/FollowerUser";
import AmIFollowingUser from "../controllers/profile/AmIFollowing";
import GetUserFriends from "../controllers/profile/GetUserFriends";
import GetUserFullProfileInformation from "../controllers/profile/GetUserFullInformation";

class CustomUserProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.message = "CustomUserProfileError";
  }
}

const profilerouter = Router();
//
profilerouter.get("/", VerifyToken, async (req: Request, res: Response) => {
  try {
    const uid = (req as any).uid;
    const result = await GetUserProfileInformation(uid);

    res.status(200).json({ userprofile: result });
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
profilerouter.get("/full", VerifyToken, async (req: Request, res: Response) => {
  try {
    const uid = (req as any).uid;
    const result = await GetUserFullProfileInformation(uid);

    res.status(200).json({ userprofile: result });
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
profilerouter.get(
  "/userfriends",
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const result = await GetUserFriends(uid);

      res.status(200).json({ userfriends: result });
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

profilerouter.post(
  "/update",
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const result = await UpdateUserProfileInformation(uid, req.body);

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
profilerouter.post(
  "/followuser",
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const result = await FollowUser(uid, req.body.userid);
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
profilerouter.post(
  "/amifollowing",
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const result = await AmIFollowingUser(uid, req.body.userid);
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
profilerouter.delete(
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
export default profilerouter;
