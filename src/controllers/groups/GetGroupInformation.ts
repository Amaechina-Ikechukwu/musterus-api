import { getFirestore } from "firebase-admin/firestore";
function removeInfo(data: any) {
  delete data.admin;
  return data;
}
export default async function GetGroupInfo(
  groupid: string
): Promise<any[] | any> {
  try {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection("groups")
      .doc(groupid)
      .collection("groupinfo")
      .doc("info")
      .get();
    if (!snapshot.exists) {
      return [];
    } else {
      return removeInfo(snapshot.data());
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching groupinfo: " + error);
    }
  }
}
