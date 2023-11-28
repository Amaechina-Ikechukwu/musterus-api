import { FieldValue, getFirestore } from "firebase-admin/firestore";
import GetUserProfileInformation from "../controllers/profile/getuserprofileinformation";

export interface Conversation {
  conversationId: string;
  participants: string[]; // Array of participant IDs
  lastMessage?: Message; // Optional last message in the conversation
  friendinfo: any;
}

export interface Message {
  text: string;
  senderId: string;
  timestamp: FieldValue;
  mediaUrl?: string; // Optional media URL
  type: string; // Message type (text, image, etc.)
}
const getFriendsId = (uid: string, participants: any) => {
  const friendid = participants.filter((part: any) => part !== uid);
  return friendid;
};
export async function getUserChatList(uid: string): Promise<Conversation[]> {
  const firestore = getFirestore();

  try {
    const conversationsSnapshot = await firestore
      .collection("direct_messages")
      .where("participants", "array-contains", uid)
      .get();

    const chatList: Conversation[] = [];

    for (const conversationDoc of conversationsSnapshot.docs) {
      const conversationData = conversationDoc.data();
      const participants: string[] = conversationData.participants;
      const conversationId = conversationDoc.id;
      const lastMessage = conversationData.lastMessage || null; // Change this if you store last message info

      const friendinfo = await GetUserProfileInformation(
        getFriendsId(uid, participants)
      );

      const conversation: Conversation = {
        conversationId,
        participants,
        lastMessage,
        friendinfo,
      };

      chatList.push(conversation);
    }

    return chatList;
  } catch (error: any) {
    console.error("Error fetching user's chat list:", error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching user's chat list: " + error);
    }
  }
}
