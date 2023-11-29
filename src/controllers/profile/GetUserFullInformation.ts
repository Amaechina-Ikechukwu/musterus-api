import { getFirestore } from "firebase-admin/firestore";
import GetGroupInfo from "../groups/GetGroupInformation";
import GetUserProfileInformation from "./getuserprofileinformation";

function removeFieldsFromUserProfile(userProfile: any) {
  delete userProfile.password;
  delete userProfile.lastUpdated;
  return userProfile;
}

export default async function GetUserFullProfileInformation(
  uid: string
): Promise<any> {
  try {
    const userDoc = await getFirestore().collection("profile").doc(uid).get();

    if (!userDoc.exists) {
      return "No such document!";
    } else {
      const user = userDoc.data();
      const followingSnapshot = await getFirestore()
        .collection("profile")
        .doc(uid)
        .collection("following")
        .get();
      const followersSnapshot = await getFirestore()
        .collection("profile")
        .doc(uid)
        .collection("followers")
        .get();

      const followingCount = followingSnapshot.size;
      const followersCount = followersSnapshot.size;

      const followingUsers: any[] = [];
      const followersUsers: any[] = [];

      // Fetch user information for each document ID in following collection
      for (const followingDoc of followingSnapshot.docs) {
        const followingUser = await GetUserProfileInformation(followingDoc.id);
        followingUsers.push(followingUser);
      }

      // Fetch user information for each document ID in followers collection
      for (const followerDoc of followersSnapshot.docs) {
        const followerUser = await GetUserProfileInformation(followerDoc.id);
        followersUsers.push(followerUser);
      }

      const groupInfo = await GetGroupInfo(uid); // Fetch group info for the given UID (assuming UID represents a group ID)

      return {
        user: removeFieldsFromUserProfile(user),
        followingCount,
        followersCount,
        followingUsers,
        followersUsers,
        groupInfo,
      };
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching user profile information: " + error);
    }
  }
}
