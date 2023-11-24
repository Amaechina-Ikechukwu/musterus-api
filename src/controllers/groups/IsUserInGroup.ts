import { getFirestore } from "firebase-admin/firestore";

export default async function IsUserInGroup(
  uid: string,
  groupid: string
): Promise<boolean> {
  try {
    const firestore = getFirestore();
    const groupRef = firestore.collection("groups").doc(groupid);
    const memberRef = groupRef.collection("members").doc(uid);

    const memberDoc = await memberRef.get();
    if (!memberDoc.exists) {
      return false;
    } else {
      // Update the existing document
      return true;
    }
  } catch (error: any) {
    console.log(error);

    throw new Error("Error checking if user is in group: " + error);
  }
}
