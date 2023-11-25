import {
  DocumentData,
  DocumentSnapshot,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  getFirestore,
} from "firebase-admin/firestore";

async function getInfo(groupid: string) {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection("groups")
    .doc(groupid)
    .collection("groupinfo")
    .doc("info")
    .get();
  if (!snapshot.exists) {
    return [];
  } else {
    return snapshot.data();
  }
}
async function getNumberOfMembers(groupid: string): Promise<DocumentData> {
  try {
    const firestore: Firestore = getFirestore();
    const docRef = firestore
      .collection("groups")
      .doc(groupid)
      .collection("members");

    const snapshot: QuerySnapshot<DocumentData> = await docRef.get();

    if (snapshot.empty) {
      return [];
    } else {
      const membersData: DocumentData = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => doc.id
      );
      return membersData;
    }
  } catch (error) {
    console.error("Error getting number of members:", error);
    throw new Error("Error getting number of members");
  }
}
async function getNumberOfPost(groupid: string) {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection("posts")
    .where("groupid", "==", groupid)
    .get();
  if (!snapshot.docs) {
    return [];
  } else {
    return snapshot.size;
  }
}
export default async function GetFullGroupInfo(
  groupid: string
): Promise<any[] | any> {
  try {
    const data = {
      group: await getInfo(groupid),
      members: await getNumberOfMembers(groupid),
      posts: await getNumberOfPost(groupid),
    };
    return data;
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching groupinfo: " + error);
    }
  }
}
