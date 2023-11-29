import {
  Firestore,
  getFirestore,
  QuerySnapshot,
  DocumentData,
  Query,
} from "firebase-admin/firestore";
import GetUserFriends from "../profile/GetUserFriends";
import GetUserProfileInformation from "../profile/getuserprofileinformation";

export default async function GetUsersPosts(uid: string): Promise<any[]> {
  try {
    const firestore: Firestore = getFirestore();
    const userFriends = await GetUserFriends(uid); // Await GetUserFriends function

    const query: Query<DocumentData> = firestore.collection("posts");

    // Create a query to fetch posts by user's friends or the user themselves
    const querySnapshot: QuerySnapshot<DocumentData> = await query
      .where("author", "in", [...userFriends, uid])
      .orderBy("createdAt")
      .get();

    const postsPromises: Promise<any>[] = querySnapshot.docs.map(
      async (doc) => {
        const postid: string = doc.id;
        const postData = doc.data();
        const authorinfo = await GetUserProfileInformation(doc.data().author);
        return { postid, ...postData, authorinfo };
      }
    );

    // Wait for all the promises to resolve
    const posts = await Promise.all(postsPromises);

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
