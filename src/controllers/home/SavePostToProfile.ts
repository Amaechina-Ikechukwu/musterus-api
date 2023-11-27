import { getFirestore } from "firebase-admin/firestore";

export default async function SavePostToProfile(
  uid: string,
  postid: string
): Promise<string> {
  try {
    await getFirestore()
      .collection("profile")
      .doc(uid)
      .collection("saved posts")
      .doc(postid)
      .set({});

    return "post saved to profile";
  } catch (error: any) {
    throw new Error("Error creating post: " + error);
  }
}
