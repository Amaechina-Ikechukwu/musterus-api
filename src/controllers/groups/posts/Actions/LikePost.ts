import { getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../../../middlewares/uuids";

export default async function LikeGroupPost(
  uid: string,
  postid: string
): Promise<string> {
  try {
    await getFirestore()
      .collection("posts")
      .doc(postid)
      .collection("likes")
      .doc(uid)
      .set({});

    return "post liked";
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
