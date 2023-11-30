import { getFirestore } from "firebase-admin/firestore";

export async function ResetPassword(
  uid: string,
  oldpassword: string,
  newpassword: string
): Promise<string | null> {
  try {
    // Get the Firestore instance

    // Reference to the user's profile document in Firestore
    const userDocRef = getFirestore().collection("profile").doc(uid); // Assuming the profiles are stored in a "profiles" collection

    if (!(await userDocRef.get()).exists) {
      return "User profile not found";
    }

    const userData = (await userDocRef.get()).data();

    // Check if the old password matches the stored password in the user's profile
    if (userData && oldpassword === userData.password) {
      // Update the password in the user's profile document

      await userDocRef.update({ password: newpassword });
      return "Password updated successfully";
    } else {
      return "Authentication error: Old password doesn't match";
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return "Error updating password";
  }
}
