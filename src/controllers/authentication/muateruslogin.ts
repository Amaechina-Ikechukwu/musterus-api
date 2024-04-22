import axios from "axios";
import { getFirestore } from "firebase-admin/firestore";

const api = axios.create({
  baseURL: "https://www.musterus.com", // Replace with your API base URL
});

export const musteruslogin = async (username: string, password: string) => {
  try {
    const response = await api.post(
      `/ws/authenticate?username=${username}&password=${password}`
    );
    const dataresponse = await api.post(
      `/ws/home?mykey=${response.data.mykey}&mskl=${response.data.mskl}`
    );
    console.log(JSON.stringify(dataresponse.data, null, 2));
    const firestore = getFirestore();
    await firestore
      .collection("profile")
      .doc(response.data.mykey)
      .set({
        username,
        password,
        ...response.data,
        ...dataresponse.data,
      });

    return response.data;
  } catch (error) {
    throw error;
  }
};
