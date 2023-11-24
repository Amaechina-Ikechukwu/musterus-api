import { Request, Response, NextFunction } from "express";

export const VerifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorizationHeader.split("Bearer ")[1];

    if (!token || token.length < 5) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Adding the UID to the request object for future use in the route handlers
    (req as any).uid = token;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
