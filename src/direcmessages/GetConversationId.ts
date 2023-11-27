import { Filter, getFirestore } from "firebase-admin/firestore";

export async function GetConversationId(
  friendId: string,
  uid: string
): Promise<string | null> {
  const firestore = getFirestore();

  try {
    // Create a reference to the 'conversationIDS' collection
    const conversationRef = firestore.collection("conversationIDS");

    // Query for conversations where both participants are present
    const conversationQuery = await conversationRef
      .where(
        Filter.or(
          Filter.where(`participants`, "==", [uid, friendId]),
          Filter.where(`participants`, "==", [friendId, uid])
        )
      )
      .get();
    if (!conversationQuery.empty) {
      // If conversations are found, return the first conversation ID
      return conversationQuery.docs[0].id;
    } else {
      // Return null if the conversation doesn't exist
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching conversation ID:", error);

    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching conversation ID: " + error);
    }
  }
}
