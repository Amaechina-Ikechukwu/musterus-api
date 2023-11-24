import { getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../middlewares/uuids";

export default async function CreateGroup(
  uid: string,
  groupInfo: any
): Promise<string> {
  try {
    const uuid = generateUniqueID();
    await getFirestore()
      .collection("groups")
      .doc(uuid)
      .collection("groupinfo")
      .doc("info")
      .set(groupInfo)
      .then(async (result) => {
        await getFirestore()
          .collection("profile")
          .doc(uid)
          .collection("groups")
          .doc(uuid)
          .set({});
      });

    return "created";
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error creating group: " + error);
    }
  }
}
