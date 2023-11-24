import { getFirestore } from "firebase-admin/firestore";
import GetGroupInfo from "./GetGroupInformation";

export default async function GetUsersGroup(uid: string): Promise<any[]> {
  try {
    const querySnapshot = await getFirestore()
      .collection("profile")
      .doc(uid)
      .collection("groups")
      .get();

    const groups = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const groupID = doc.id;
        try {
          const data = await GetGroupInfo(groupID);
          return { groupID, data };
        } catch (err) {
          throw new Error("Error assigning group info: " + err);
        }
      })
    );

    return groups;
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching user groups: " + error);
    }
  }
}
