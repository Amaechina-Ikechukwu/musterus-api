import { getFirestore, FieldValue } from "firebase-admin/firestore";

export default async function SeenGroupMessage({
  messageid,
  uid,
  groupid,
}: {
  messageid: string;
  uid: string;
  groupid: string;
}): Promise<any> {
  const firestore = getFirestore();

  try {
    // Create a reference to the 'groups' collection
    const groupsRef = firestore.collection("groups");

    // Check if the uid exists in the 'seenby' collection for the given message
    const seenByRef = groupsRef
      .doc(groupid)
      .collection("chats")
      .doc(messageid)
      .collection("seenby")
      .doc(uid);

    const docSnapshot = await seenByRef.get();

    if (!docSnapshot.exists) {
      // If the uid doesn't exist, set it in the 'seenby' collection
      await seenByRef.set({ timestamp: FieldValue.serverTimestamp() });
      return "seen";
    } else {
      return "alreadySeen";
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };

      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error adding user to database" + error);
    }
  }
}
