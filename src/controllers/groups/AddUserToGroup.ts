import { getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../middlewares/uuids";

export default async function AddUserToGroup(
  uid: string,
  groupid: string,
  userid: string
): Promise<string> {
  try {
    const firestore = getFirestore();
    const groupRef = firestore.collection("groups").doc(groupid);
    const memberRef = groupRef.collection("members").doc(userid);
    const adminRef = groupRef.collection("admins").doc(uid);
    const adminDoc = adminRef.get();
    if ((await adminDoc).exists) {
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
        return "user added";
      } else {
        // Update the existing document
        return "user is already in this group";
      }
    } else {
      throw new Error("You are not an Admin");
    }
  } catch (error: any) {
    throw new Error("Error joining group: " + error);
  }
}
