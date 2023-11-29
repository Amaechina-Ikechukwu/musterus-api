import {
  Firestore,
  getFirestore,
  QuerySnapshot,
  DocumentData,
  Query,
} from "firebase-admin/firestore";
import GetUserFriends from "../profile/GetUserFriends";
import GetUserProfileInformation from "../profile/getuserprofileinformation";

interface PostData {
  postid: string;
  [key: string]: any; // Define the structure of your post data
}

export default async function GetUsersPosts(uid: string): Promise<PostData[]> {
  try {
    const firestore: Firestore = getFirestore();
    const userFriends = await GetUserFriends(uid);

    const query: Query<DocumentData> = firestore.collection("posts");

    // Create a query to fetch posts by user's friends or the user themselves
    const querySnapshot: QuerySnapshot<DocumentData> = await query
      .where("author", "in", [...userFriends, uid]) // Ensure userFriends is an array of UIDs
      .orderBy("createdAt", "desc")
      .get();

    const postsPromises: Promise<PostData>[] = querySnapshot.docs.map(
      async (doc) => {
        const postid: string = doc.id;
        const postData = doc.data();
        const authorinfo = await GetUserProfileInformation(postData.author);
        return { postid, ...postData, authorinfo };
      }
    );

    // Wait for all the promises to resolve
    const posts: PostData[] = await Promise.all(postsPromises);

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
