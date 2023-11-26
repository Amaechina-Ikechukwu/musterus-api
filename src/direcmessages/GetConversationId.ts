import { getFirestore } from "firebase-admin/firestore";

export async function GetConversationId(
  friendId: string,
  uid: string
): Promise<string | null> {
  const firestore = getFirestore();

  try {
    // Create a reference to the 'conversationIDs' collection
    const conversationRef = firestore.collection("conversationIDS");

    // Query for conversations where both participants are present
    const conversationQuery = await conversationRef
      .where("participants", "array-contains", [uid, friendId])
      .get();

    if (!conversationQuery.empty) {
      // If conversations are found, return the first conversation ID
      console.log(conversationQuery.docs);
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
