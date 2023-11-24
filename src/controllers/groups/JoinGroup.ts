import { getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../middlewares/uuids";

export default async function JoinGroup(
  uid: string,
  groupid: string
): Promise<string> {
  try {
    const firestore = getFirestore();
    const groupRef = firestore.collection("groups").doc(groupid);
    const memberRef = groupRef.collection("members").doc(uid);

    const memberDoc = await memberRef.get();
    if (!memberDoc.exists) {
      await memberRef.set({}).then(async (result) => {
        await getFirestore()
          .collection("profile")
          .doc(uid)
          .collection("groups")
          .doc(groupid)
          .set({});
      });
      return "joined";
    } else {
      // Update the existing document
      return "user is already in this group";
    }
  } catch (error: any) {
    console.log(error);

    throw new Error("Error joining group: " + error);
  }
}
