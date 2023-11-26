import { getFirestore } from "firebase-admin/firestore";

export default async function CommentOnPost(
  uid: string,
  comment: string,
  postid: string
): Promise<string> {
  try {
    await getFirestore()
      .collection("posts")
      .doc(postid)
      .collection("comments")
      .doc()
      .set({ comment: comment, author: uid });

    return "commented on post";
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
