import { auth, FirebaseError } from "firebase-admin";
import { User } from "../../interfaces/userinterface";
import AddUserToDatabase from "./addusertodatabase";

export async function CreateUser(user: User) {
  try {
    const userRecord = await auth().createUser({
      email: user.email,
      // phoneNumber: user.phoneNumber,
      password: user.password,
      displayName: user.fullName,
      photoURL: user.photoURL,
      disabled: false,
    });

    await AddUserToDatabase(userRecord.uid, user)
      .then(() => {})
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });
    return userRecord.uid;
  } catch (error: any) {
    throw new Error(error);
  }
}
