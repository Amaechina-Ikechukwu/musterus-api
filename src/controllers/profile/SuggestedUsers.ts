import { getFirestore } from "firebase-admin/firestore";
import GetUserProfileInformation from "./getuserprofileinformation";
import AmIFollowingUser from "./AmIFollowing";

function removeFieldsFromUserProfile(userProfile: any) {
  delete userProfile.password;
  return userProfile;
}

export default async function GetSuggestedUsers(uid: string): Promise<any[]> {
  try {
    const firestore = getFirestore();
    const friendsCollection = await firestore.collection("profile").get();
    const suggestedUser: any = [];

    if (friendsCollection.empty) {
      return []; // Return an empty array if the user has no friends
    } else {
      // Retrieve each friend's data and determine if the user is following them
      const friendsDataPromises = friendsCollection.docs.map(
        async (friendDoc) => {
          if (friendDoc.id !== uid) {
            const friendId = friendDoc.id;
            const userData = await GetUserProfileInformation(friendId);
            const isFollowing = await AmIFollowingUser(uid, friendId);

            const friendWithFollowing = {
              id: friendId,
              ...userData,
              isFollowing,
            };
            suggestedUser.push(friendWithFollowing);
          }
        }
      );

      await Promise.all(friendsDataPromises); // Wait for all promises to resolve
      return suggestedUser;
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
