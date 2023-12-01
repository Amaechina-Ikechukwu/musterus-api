import { auth, FirebaseError } from "firebase-admin";
import { User } from "../../interfaces/userinterface";
import AddUserToDatabase from "./addusertodatabase";
import { getFirestore } from "firebase-admin/firestore";
import { CreateToken } from "./createtoken";
import { musteruslogin } from "./muateruslogin";
import { initializeprofile } from "./initializprofile";

export async function LoginUser(user: User) {
  try {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection("profile")
      .where("email", "==", user.email)
      .where("password", "==", user.password)
      .get();
    if (snapshot.empty) {
      try {
        const result = await musteruslogin(user.email, user.password);

        await initializeprofile(result.mykey, result.mskl, user.password);
        return result.mykey;
      } catch (err: any) {
        throw new Error("No user found");
      }
    }

    const profile: any[] = [];
    snapshot.forEach((doc) => {
      profile.push(doc.id);
    });
    return profile[0];
  } catch (error: any) {
    throw new Error(error);
  }
}
