import { getFirestore } from "firebase-admin/firestore";

export default async function AddUserToDatabase(
  uid: string,
  data: any
): Promise<any> {
  try {
    const userData: any = {
      uid: data?.uid,
      email: data?.email,
      emailVerified: data?.emailVerified,
      displayName: data?.displayName,
      disabled: data?.disabled,
      tokensValidAfterTime: data?.tokensValidAfterTime,
      providerData: data?.providerData?.map((provider: any) => ({
        uid: provider.uid,
        displayName: provider.displayName,
        email: provider.email,
        providerId: provider.providerId,
      })),
      // Additional fields
      phoneNumber: data?.phoneNumber,
      photoURL: data?.photoURL,
      // Metadata? fields
      metadata: {
        creationTime: data?.metadata?.creationTime,
        lastSignInTime: data?.metadata?.lastSignInTime,
        // Add other relevant metadata? fields
      },
    };
    const res = await getFirestore().collection("profile").doc(uid).set(data);

    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
