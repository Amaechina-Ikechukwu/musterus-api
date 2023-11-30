import {
  getFirestore,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase-admin/firestore";

const getGroupInfo = async (groupId: string): Promise<DocumentSnapshot> => {
  const groupInfoRef = getFirestore()
    .collection("groups")
    .doc(groupId)
    .collection("groupinfo")
    .doc("info");

  // Fetch the groupInfo document
  const groupInfoDoc = await groupInfoRef.get();
  return groupInfoDoc;
};

export default async function SuggestedGroups(uid: string): Promise<any[]> {
  try {
    const db = getFirestore(); // Get the Firestore instance

    // Get all documents from the groups collection
    const groupsSnapshot: QuerySnapshot = await db.collection("groups").get();

    const suggestedGroups: any[] = [];
    const allGroupIds: string[] = []; // Array to store all group ids
    console.log(groupsSnapshot.size);
    // Store all group IDs in an array
    groupsSnapshot.forEach((groupDoc) => {
      const groupId = groupDoc.id;
      allGroupIds.push(groupId);
      console.log(groupId); // Log each group id
    });

    console.log(allGroupIds); // Log all group ids here

    // Iterate through each group ID
    for (const groupId of allGroupIds) {
      const groupInfoDoc: DocumentSnapshot = await getGroupInfo(groupId);

      // Get reference to the groupInfo document in the groups collection
      if (groupInfoDoc.exists) {
        const groupInfoData: any = groupInfoDoc.data();
        const groupInfoRef = getFirestore().collection("groups").doc(groupId);

        // Check if the user is in the admins collection
        const adminDoc = await groupInfoRef.collection("admins").doc(uid).get();
        if (adminDoc.exists) {
          // User is an admin in the group
          suggestedGroups.push({ groupId, role: "admin" });
          console.log(`${uid} is an admin in the group ${groupId}`);
        } else {
          // Check if the user is in the members collection
          const memberDoc = await groupInfoRef
            .collection("members")
            .doc(uid)
            .get();
          if (memberDoc.exists) {
            // User is a member in the group
            suggestedGroups.push({ groupId, role: "member" });
            console.log(`${uid} is a member in the group ${groupId}`);
          }
        }
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
