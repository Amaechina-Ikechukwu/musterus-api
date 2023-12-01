import {
  getFirestore,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase-admin/firestore";

// ... (other imports and functions)

const getGroupInfo = async (groupId: string): Promise<DocumentSnapshot> => {
  const groupInfoRef = getFirestore()
    .collection("groups")
    .doc(groupId)
    .collection("groupinfo")
    .doc("info");

  const groupInfoDoc = await groupInfoRef.get();
  return groupInfoDoc;
};

export default async function SuggestedGroups(uid: string): Promise<any[]> {
  try {
    const db = getFirestore();
    const groupsSnapshot: QuerySnapshot = await db
      .collectionGroup("groups")
      .get();

    const suggestedGroups: any[] = [];

    for (const groupDoc of groupsSnapshot.docs) {
      const groupId = groupDoc.id;
      const groupInfoDoc: DocumentSnapshot = await getGroupInfo(groupId);

      if (groupInfoDoc.exists) {
        const groupInfoData: any = groupInfoDoc.data();
        const groupInfoRef = db.collection("groups").doc(groupId);

        // Check if the user is an admin or member in the group
        const adminDoc = await groupInfoRef.collection("admins").doc(uid).get();
        const memberDoc = await groupInfoRef
          .collection("members")
          .doc(uid)
          .get();

        if (adminDoc.exists || memberDoc.exists) {
          // User is neither an admin nor a member in the group
          continue; // Skip this group, proceed to the next one
        }

        let role = "";
        if (adminDoc.exists) {
          role = "admin";
        } else if (memberDoc.exists) {
          role = "member";
        }

        suggestedGroups.push({
          groupId,
          role,
          group: groupInfoData,
        });
      } else {
        console.log(`Group info for ${groupId} does not exist.`);
      }
    }

    return suggestedGroups;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error fetching user groups: " + error);
  }
}
