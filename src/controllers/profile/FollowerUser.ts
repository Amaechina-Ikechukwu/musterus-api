import { FieldValue, getFirestore } from "firebase-admin/firestore";

function removeFieldsFromUserProfile(userProfile: any) {
  delete userProfile.password;
  return userProfile;
}

export default async function FollowUser(
  uid: string,
  userid: string
): Promise<string> {
  try {
    await getFirestore()
      .collection("profile")
      .doc(uid)
      .collection("following")
      .doc(userid)
      .set({ added: FieldValue.serverTimestamp() });
    await getFirestore()
      .collection("profile")
      .doc(userid)
      .collection("followers")
      .doc(uid)
      .set({ added: FieldValue.serverTimestamp() });

    return "added";
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
