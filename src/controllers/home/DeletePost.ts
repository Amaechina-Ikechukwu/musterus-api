import { FieldValue, getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../middlewares/uuids";

export default async function DeletePost(
  uid: string,

  postid: string
): Promise<string> {
  try {
    await getFirestore().collection("posts").doc(postid).delete();

    return "post deleted";
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
