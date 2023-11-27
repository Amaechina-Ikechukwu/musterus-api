import { FieldValue, getFirestore } from "firebase-admin/firestore";

function removeFieldsFromUserProfile(userProfile: any) {
  delete userProfile.password;
  return userProfile;
}

export default async function AmIFollowingUser(
  uid: string,
  userid: string
): Promise<boolean> {
  try {
    const result = await getFirestore()
      .collection("profile")
      .doc(uid)
      .collection("following")
      .doc(userid)
      .get();
    return result.exists;
  } catch (error: any) {
    console.error("Error fetching user's friends:", error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching user's friends: " + error);
    }
  }
}
