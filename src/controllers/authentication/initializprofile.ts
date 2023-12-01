import axios from "axios";
import { auth } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const api = axios.create({
  baseURL: "https://www.musterus.com", // Replace with your API base URL
});

export const initializeprofile = async (
  mykey: string,
  mskl: string,
  password: string
) => {
  try {
    const response = await api.get(`/ws/myprofile?mykey=${mykey}&mskl=${mskl}`);

    const firestore = getFirestore();
    await auth().createUser({
      uid: mykey,
      email: response.data.MyProfile.registeremail,
      // phoneNumber: response.data.MyProfile.phoneNumber,
      password: password,
      displayName:
        response.data.MyProfile.firstname +
        " " +
        response.data.MyProfile.lastname,
      photoURL: response.data.MyProfile.photoURL,
      disabled: false,
    });
    await firestore
      .collection("profile")
      .doc(mykey)
      .set({ ...response.data.MyProfile, password });

    return response.data;
  } catch (error) {
    throw error;
  }
};
