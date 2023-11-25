import {
  Firestore,
  getFirestore,
  DocumentData,
} from "firebase-admin/firestore";
import GetGroupInfo from "../GetGroupInformation";
import GetUserProfileInformation from "../../profile/getuserprofileinformation";
function deleteInfo(data: any) {
  delete data.password;
  return data;
}
export default async function SingleGroupPost(postid: string): Promise<any> {
  try {
    const firestore: Firestore = getFirestore();

    const grouppost = await firestore.collection("posts").doc(postid).get();
    const postData: DocumentData | undefined = grouppost.data();

    if (!postData) {
      throw new Error("Post data not found");
    }

    const authorID = postData.author;
    const authorProfile = await GetUserProfileInformation(authorID);

    const groupID: string = postData.groupid;
    const groupInfo = await GetGroupInfo(groupID);

    const data = {
      ...postData,
      group: groupInfo,
      author: deleteInfo(authorProfile),
    };

    return data;
  } catch (error: any) {
    throw new Error("Error retrieving post information: " + error);
  }
}
