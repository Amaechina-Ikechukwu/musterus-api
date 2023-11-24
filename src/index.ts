import express, { Request, Response, NextFunction } from "express";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import router from "./routes/authroute";
import profilerouter from "./routes/profileroute";
import messagingRouter from "./routes/messagingroute";
import grouprouter from "./routes/grouproute";

const app = express();
app.use(express.json());
var serviceAccount = require("../x.json");
initializeApp({
  credential: cert(serviceAccount),
});

const firestore = getFirestore();
firestore.settings({
  ignoreUndefinedProperties: true,
});

app.use("/auth", router);
app.use("/profile", profilerouter);
app.use("/groups", grouprouter);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: err.message });
});

export default app;
