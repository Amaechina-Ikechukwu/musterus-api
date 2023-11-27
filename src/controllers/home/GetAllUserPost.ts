import {
  Firestore,
  getFirestore,
  QuerySnapshot,
  DocumentData,
  Query,
} from "firebase-admin/firestore";
import GetUserFriends from "../profile/GetUserFriends";

export default async function GetUsersPosts(uid: string): Promise<any[]> {
  try {
    const firestore: Firestore = getFirestore();
    const userFriends = await GetUserFriends(uid); // Await GetUserFriends function

    const query: Query<DocumentData> = firestore.collection("posts");

    // Create a query to fetch posts by user's friends or the user themselves
    const querySnapshot: QuerySnapshot<DocumentData> = await query
      .where("author", "in", [...userFriends, uid])
      .get();

    const posts: any[] = querySnapshot.docs.map((doc) => {
      const postid: string = doc.id;
      const postData = doc.data();
      return { postid, ...postData };
    });

    return posts;
  } catch (error: any) {
    console.error("Error fetching posts:", error);

    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      throw new Error(firebaseError.message || "Firebase error occurred");
    } else {
      throw new Error("Error fetching posts: " + error);
    }
  }
}