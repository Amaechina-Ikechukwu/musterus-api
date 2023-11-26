import { getFirestore } from "firebase-admin/firestore";

export default async function SinglePost(postid: string): Promise<any> {
  try {
    const result = await getFirestore().collection("posts").doc(postid).get();

    return result.data();
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
