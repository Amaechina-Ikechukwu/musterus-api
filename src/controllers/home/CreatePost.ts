import { getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../middlewares/uuids";

export default async function CreatePost(
  uid: string,

  postinfo: any
): Promise<string> {
  try {
    const postid = generateUniqueID();
    await getFirestore()
      .collection("posts")
      .doc(postid)
      .set({ ...postinfo, author: uid });

    return "post created";
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
