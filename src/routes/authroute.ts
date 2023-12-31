import { Router, Request, Response, NextFunction } from "express";
import { User } from "../interfaces/userinterface";
import { CreateUser } from "../controllers/authentication/createuser";
import { CreateToken } from "../controllers/authentication/createtoken";
import { checkRequestBodyParams } from "../middlewares/authmiddleware";
import { VerifyEmail } from "../controllers/authentication/verifyemail";
import { VerifyToken } from "../middlewares/verifytoken";
import { DeleteUser } from "../controllers/authentication/deleteuser";
import { LoginUser } from "../controllers/authentication/loginuser";
import { ResetPassword } from "../controllers/authentication/resetpassword";
const router = Router();
class CustomUserProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomUserProfileError";
  }
}
router.post(
  "/signup",
  checkRequestBodyParams([
    "email",
    "password",
    "firstname",
    "lastname",
    "username",
    "birthdate",
  ]),
  async (req: Request, res: Response) => {
    try {
      const userData = req.body as User;
      const result = await CreateUser(userData);
      res.status(200).json({ mykey: result });
    } catch (err: any) {
      return res.json({ error: err });
    }
  }
);
router.post(
  "/login",
  checkRequestBodyParams(["email", "password"]),
  async (req: Request, res: Response) => {
    try {
      const userData = req.body as User;
      const result = await LoginUser(userData);
      if (result == "No user found") {
        res.status(401).json({ message: result });
      }
      res.status(200).json({ mykey: result });
    } catch (err: any) {
      return res.status(400).json({ error: err });
    }
  }
);
router.post(
  "/resetpassword",
  checkRequestBodyParams(["oldpassword", "newpassword"]),
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const { oldpassword, newpassword } = req.body;
      const result = await ResetPassword(uid, oldpassword, newpassword);
      res.status(200).json({ message: result });
    } catch (err: any) {
      console.log(err);
      return res.json({ error: err });
    }
  }
);
router.post(
  "/verifyemail",
  checkRequestBodyParams(["redirectUri", "email"]),
  async (req: Request, res: Response) => {
    try {
      const { redirectUri, email } = req.body;
      const result = await VerifyEmail(redirectUri, email);

      res.status(200).json({ userToken: result });
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
router.delete(
  "/deleteuser",
  VerifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const result = await DeleteUser(uid);

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
export default router;
