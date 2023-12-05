import { getFirestore } from "firebase-admin/firestore";

export default async function LikePost(
  uid: string,
  postid: string,
  action: string
): Promise<string> {
  try {
    await getFirestore()
      .collection("posts")
      .doc(postid)
      .collection("likes")
      .doc(uid)
      .set({ action });

    return "post liked";
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
