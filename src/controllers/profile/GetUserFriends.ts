import { getFirestore } from "firebase-admin/firestore";
import GetUserProfileInformation from "./getuserprofileinformation";

function removeFieldsFromUserProfile(userProfile: any) {
  const { password, ...rest } = userProfile;
  return rest;
}

export default async function GetUserFriends(uid: string): Promise<any[]> {
  try {
    const friendsCollection = await getFirestore()
      .collection("profile")
      .doc(uid)
      .collection("following")
      .get();

    if (friendsCollection.empty) {
      return []; // Return an empty array if the user has no friends
    } else {
      const friendInfo: any[] = [];

      // Map through the friends collection and retrieve each friend's data
      for (const friendDoc of friendsCollection.docs) {
        const friend = await GetUserProfileInformation(friendDoc.id);
        friendInfo.push({ id: friendDoc.id, ...friend });
      }

      return friendInfo;
    }
  } catch (error: any) {
    console.error("Error fetching user's friends:", error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching user's friends: " + error);
    }
  }
}
