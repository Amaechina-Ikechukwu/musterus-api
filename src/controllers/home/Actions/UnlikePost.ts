import { getFirestore } from "firebase-admin/firestore";

export default async function UnLikePost(
  uid: string,

  postid: string
): Promise<string> {
  try {
    await getFirestore()
      .collection("posts")
      .doc(postid)
      .collection("likes")
      .doc(uid)
      .delete({});

    return "post unliked";
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
