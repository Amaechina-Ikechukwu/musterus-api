import axios from "axios";
import { getFirestore } from "firebase-admin/firestore";

const api = axios.create({
  baseURL: "https://www.musterus.com", // Replace with your API base URL
});

export const initializeprofile = async (mykey: string, mskl: string) => {
  try {
    const response = await api.get(`/ws/myprofile?mykey=${mykey}&mskl=${mskl}`);

    const firestore = getFirestore();
    await firestore
      .collection("profile")
      .doc(mykey)
      .set(response.data.MyProfile);

    return response.data;
  } catch (error) {
    throw error;
  }
};
