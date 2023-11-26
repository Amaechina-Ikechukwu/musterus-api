import { getFirestore } from "firebase-admin/firestore";

function removeFieldsFromUserProfile(userProfile: any) {
  delete userProfile.password;
  return userProfile;
}

export default async function GetUserFriends(uid: string): Promise<any[]> {
  try {
    const friendsCollection = await getFirestore()
      .collection("profile")
      .doc(uid)
      .collection("friends")
      .get();

    if (friendsCollection.empty) {
      return []; // Return an empty array if the user has no friends
    } else {
      // Map through the friends collection and retrieve each friend's data
      const friendsData = friendsCollection.docs.map((friendDoc) => {
        const friend = friendDoc.data();
        return friend;
      });

      return friendsData;
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
