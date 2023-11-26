import { getFirestore } from "firebase-admin/firestore";
import generateUniqueID from "../../middlewares/uuids";

export default async function CreateGroupPost(
  uid: string,

  groupid: string,
  postinfo: any
): Promise<string> {
  try {
    const postid = generateUniqueID();
    await getFirestore()
      .collection("posts")
      .doc(postid)
      .set({ ...postinfo, author: uid, groupid });

    return "post created";
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
