import { Router, Request, Response, NextFunction } from "express";

import { VerifyToken } from "../middlewares/verifytoken";
import { DeleteUser } from "../controllers/authentication/deleteuser";

import CreateGroup from "../controllers/groups/CreateGroup";
import { checkRequestBodyParams } from "../middlewares/authmiddleware";
import SendMessageToGroup from "../controllers/groups/messaging/SendMessage";
import JoinGroup from "../controllers/groups/JoinGroup";
import IsUserInGroup from "../controllers/groups/IsUserInGroup";
import CreateGroupPost from "../controllers/groups/posts/CreatePost";
import UnLikeGroupPost from "../controllers/groups/posts/Actions/UnlikePost";
import CommentOnPost from "../controllers/groups/posts/CommentOnPost";
import LikeGroupPost from "../controllers/groups/posts/Actions/LikePost";
import GetUsersGroup from "../controllers/groups/GetUsersGroup";
import SingleGroupPost from "../controllers/groups/posts/SingleGroupPost";
import SavePostToProfile from "../controllers/groups/posts/SavePostToProfile";
import GetFullGroupInfo from "../controllers/groups/GetFullGroupInformation";
import GetGroupPosts from "../controllers/groups/posts/GetAllGroupPost";
import {
  GetListOfAdmins,
  IsUserGroupAdmin,
  MakeAnAdmin,
} from "../controllers/groups/AdminActions";
import UpdateGroup from "../controllers/groups/UpdateGroup";
import SuggestedGroups from "../controllers/groups/SuggestedGroups";
import AddUserToGroup from "../controllers/groups/AddUserToGroup";

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
grouprouter.get("/", VerifyToken, async (req: Request, res: Response) => {
  try {
    const uid = (req as any).uid;
    const result = await SuggestedGroups(uid);

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
});

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
  "/updategroup",
  checkRequestBodyParams(["name", "description", "photourl", "groupid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { name, photourl, description, groupid } = req.body;
      const groupInfo = { name, photourl, description, admin: uid };
      const result = await UpdateGroup(uid, groupid, groupInfo);

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
      const { message, groupid, mediaurl } = req.body;
      const result = await SendMessageToGroup(uid, groupid, message, mediaurl);

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
  "/addusertogroup",
  checkRequestBodyParams(["groupid", "friendid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { groupid, friendid } = req.body;
      const result = await AddUserToGroup(uid, groupid, friendid);

      res.status(200).json({ message: result });
    } catch (err: any) {
      return res.status(401).json({ error: err });
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
  checkRequestBodyParams(["postid", "action"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { postid, action } = req.body;
      const result = await LikeGroupPost(uid, postid, action);

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
grouprouter.post(
  "/singlegrouppost",
  checkRequestBodyParams(["postid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { postid } = req.body;

      const result = await SingleGroupPost(postid);

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
grouprouter.post(
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
grouprouter.post(
  "/fullgroupinfo",
  checkRequestBodyParams(["groupid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { groupid } = req.body;

      const result = await GetFullGroupInfo(groupid);

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
grouprouter.post(
  "/groupposts",
  checkRequestBodyParams(["groupid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { groupid } = req.body;

      const result = await GetGroupPosts(groupid);

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
grouprouter.post(
  "/makeuseradmin",
  checkRequestBodyParams(["groupid", "userid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { groupid, userid } = req.body;
      const admin = await IsUserGroupAdmin(uid, groupid);
      if (admin) {
        const result = await MakeAnAdmin(userid, groupid);
        res.status(200).json({ message: result });
      } else {
        res.status(401).json({ message: "You dont have admin permissions" });
      }
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
  "/isuseradmin",
  checkRequestBodyParams(["groupid", "userid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { groupid, userid } = req.body;
      const admin = await IsUserGroupAdmin(userid, groupid);

      res.status(200).json({ message: admin });
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
  "/listofadmins",
  checkRequestBodyParams(["groupid"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { groupid } = req.body;
      const admin = await GetListOfAdmins(groupid);

      res.status(200).json({ message: admin });
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
