import { getFirestore } from "firebase-admin/firestore";
import GetGroupInfo from "./GetGroupInformation";

export default async function SuggestedGroups(uid: string): Promise<any[]> {
  try {
    const querySnapshot = await getFirestore().collection("groups").get();

    const groups = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const groupID = doc.id;
        try {
          const data = await GetGroupInfo(groupID);
          // Check if the UID exists in either 'admin' or 'members' collection
          const adminRef = getFirestore()
            .collection("groups")
            .doc(groupID)
            .collection("admins")
            .doc(uid);
          const memberRef = getFirestore()
            .collection("groups")
            .doc(groupID)
            .collection("members")
            .doc(uid);

          const [isAdmin, isMember] = await Promise.all([
            adminRef.get(),
            memberRef.get(),
          ]);

          if (!isAdmin.exists && !isMember.exists) {
            return { groupID, data };
          } else {
            return null; // If UID exists in admin or members, don't include this group
          }
        } catch (err) {
          throw new Error("Error assigning group info: " + err);
        }
      })
    );

    // Filter out null entries (groups where the user exists as admin or member)
    return groups.filter((group) => group !== null) as any[];
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
