import { getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../middlewares/uuids";
import GetUserProfileInformation from "../profile/getuserprofileinformation";

export async function MakeAnAdmin(
  uid: string,
  groupid: string
): Promise<string> {
  try {
    const firestore = getFirestore();
    const groupRef = firestore.collection("groups").doc(groupid);
    const memberRef = groupRef.collection("admins");

    const memberDoc = await memberRef.doc(uid).get();
    if (!memberDoc.exists) {
      await memberRef.doc(uid).set({}); // Promote user to admin

      return "joined as admin";
    } else {
      // User is already an admin
      return "user is already an admin in this group";
    }
  } catch (error: any) {
    console.log(error);

    throw new Error("Error promoting user to admin: " + error);
  }
}

export async function GetListOfAdmins(groupid: string): Promise<any[]> {
  try {
    const firestore = getFirestore();
    const groupRef = firestore.collection("groups").doc(groupid);
    const adminsRef = groupRef.collection("admins");

    const adminsSnapshot = await adminsRef.get();
    const adminListPromises: Promise<any>[] = [];

    adminsSnapshot.forEach((doc) => {
      const userPromise = GetUserProfileInformation(doc.id)
        .then((user) => {
          // Sanitize sensitive information
          delete user.password;
          return user;
        })
        .catch((error) => {
          console.error(`Error fetching user profile for ${doc.id}: ${error}`);
          return null;
        });

      adminListPromises.push(userPromise);
    });

    const adminList = await Promise.all(adminListPromises);
    return adminList.filter((user) => user !== null);
  } catch (error: any) {
    console.error("Error getting list of admins:", error);
    throw new Error("Error getting list of admins: " + error);
  }
}

export async function IsUserGroupAdmin(
  uid: string,
  groupid: string
): Promise<boolean> {
  try {
    const firestore = getFirestore();
    const groupRef = firestore.collection("groups").doc(groupid);
    const adminRef = groupRef.collection("admins").doc(uid);

    const adminDoc = await adminRef.get();
    return adminDoc.exists;
  } catch (error: any) {
    console.log(error);

    throw new Error("Error checking if user is group admin: " + error);
  }
}
