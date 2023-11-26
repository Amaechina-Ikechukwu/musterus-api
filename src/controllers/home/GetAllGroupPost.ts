import {
  Firestore,
  getFirestore,
  QuerySnapshot,
  DocumentData,
} from "firebase-admin/firestore";

export default async function GetUsersPosts(groupid: string): Promise<any[]> {
  try {
    const firestore: Firestore = getFirestore();

    const querySnapshot: QuerySnapshot<DocumentData> = await firestore
      .collection("posts")
      .where("author", "in", groupid)
      .get();

    const posts: any[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const postid: string = doc.id;
        try {
          const postData = doc.data();
          return { postid, ...postData };
        } catch (err) {
          throw new Error("Error assigning group info: " + err);
        }
      })
    );

    return posts;
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching group posts: " + error);
    }
  }
}
