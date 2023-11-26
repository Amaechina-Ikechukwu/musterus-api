import { getFirestore, FieldValue } from "firebase-admin/firestore";

export default async function InitializeChat(
  uid: string,
  friendid: string
): Promise<any> {
  const firestore = getFirestore();

  try {
    // Create a reference to the 'direct messages' collection
    const messagesRef = firestore.collection("conversationIDS");

    // Create a conversation document ID by concatenating user IDs
    const conversationId = [uid, friendid].sort().join("_");

    // Check if the conversation exists in 'direct messages'
    const conversationSnapshot = await messagesRef.doc(conversationId).get();

    if (!conversationSnapshot.exists) {
      // If the conversation doesn't exist, create it
      await messagesRef
        .doc(conversationId)
        .set({ participants: [uid, friendid] });
      return "chatInitialized";
    } else {
      return "chatExists";
    }
  } catch (error: any) {
    console.log(error);
    throw new Error("Error initializing chat" + error);
  }
}
