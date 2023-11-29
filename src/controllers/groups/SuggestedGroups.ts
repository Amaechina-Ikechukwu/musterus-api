import { getFirestore } from "firebase-admin/firestore";
import GetGroupInfo from "./GetGroupInformation";

export default async function SuggestedGroups(uid: string): Promise<any[]> {
  try {
    const db = getFirestore();
    const querySnapshot = await db.collection("groups").get();

    const filterGroups = async (doc: any) => {
      console.log(doc);
      const groupID = doc.id;
      try {
        const data = await GetGroupInfo(groupID);
        const adminRef = await db
          .collection("groups")
          .doc(groupID)
          .collection("admins")
          .doc(uid)
          .get();
        const memberRef = await db
          .collection("groups")
          .doc(groupID)
          .collection("members")
          .doc(uid)
          .get();

        if (!adminRef.exists && !memberRef.exists) {
          return { groupID, ...data };
        } else {
          return null;
        }
      } catch (err) {
        console.error("Error assigning group info:", err);
        return Promise.reject("Error assigning group info: " + err);
      }
    };

    const groupsPromises: Promise<any | null>[] =
      querySnapshot.docs.map(filterGroups);
    const groups = await Promise.all(
      groupsPromises.map((p) => p.catch((e) => e))
    );

    return groups.filter((group) => group !== null) as any[];
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw new Error("Error fetching user groups: " + error);
  }
}
