import { getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../middlewares/uuids";
import { MakeAnAdmin } from "./AdminActions";

export default async function UpdateGroup(
  uid: string,
  groupid: string,
  groupInfo: any
): Promise<string> {
  try {
    await getFirestore()
      .collection("groups")
      .doc(groupid)
      .collection("groupinfo")
      .doc("info")
      .update(groupInfo);

    return "updated";
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
