import { getFirestore, FieldValue } from "firebase-admin/firestore";

export interface Message {
  author: string;
  reciever: string;
  text: string;
  sent: FieldValue;
  mediaurl?: string; // Optional media URL
  type: string; // Message type (text, image, etc.)
}

export default async function SendMessage(
  conversationid: string,
  message: Message
): Promise<string> {
  const firestore = getFirestore();

  try {
    // Create a reference to the 'direct_messages' collection
    const messagesRef = firestore
      .collection("direct_messages")
      .doc(conversationid)
      .collection("messages");

    // Validate message type
    if (!["text", "image", "audio", "video"].includes(message.type)) {
      throw new Error("Invalid message type: " + message.type);
    }

    // Add the message to the conversation subcollection
    await messagesRef.add(message);

    const participants = conversationid.split("_");

    // Update participants in a separate collection (if needed)
    await firestore
      .collection("direct_messages")
      .doc(conversationid)
      .set({ participants }); // Set participants directly in the conversation document

    return "messageSent";
  } catch (error: any) {
    console.error("Error sending message:", error);

    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error sending message: " + error);
    }
  }
}
