import {
  getFirestore,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase-admin/firestore";

const getGroupInfo = async (groupId: string) => {
  const groupInfoRef = getFirestore()
    .collection("groups")
    .doc(groupId)
    .collection("groupinfo")
    .doc("info");

  const groupInfoDoc = await groupInfoRef.get();
  return groupInfoDoc;
};

// Existing imports and functions...

export default async function SuggestedGroups(uid: string) {
  try {
    const db = getFirestore();
    const groupsSnapshot = await db.collectionGroup("groups").get();

    const suggestedGroups = [];
    const uniqueGroupIds = new Set(); // Track unique group IDs

    for (const groupDoc of groupsSnapshot.docs) {
      const groupId = groupDoc.id;

      // Check if the group ID is already processed
      if (uniqueGroupIds.has(groupId)) {
        continue; // Skip already processed group
      }

      const groupInfoDoc = await getGroupInfo(groupId);

      if (groupInfoDoc.exists) {
        const groupInfoData = groupInfoDoc.data();
        const groupInfoRef = db.collection("groups").doc(groupId);

        // Check if the user is an admin in the group
        const adminDoc = await groupInfoRef.collection("admins").doc(uid).get();

        // Check if the user is a member in the group
        const memberDoc = await groupInfoRef
          .collection("members")
          .doc(uid)
          .get();

        if (!adminDoc.exists && !memberDoc.exists) {
          // User is neither an admin nor a member in the group
          suggestedGroups.push({
            groupId,
            group: groupInfoData,
          });

          uniqueGroupIds.add(groupId); // Add group ID to the set
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
