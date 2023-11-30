import { getFirestore, QuerySnapshot } from "firebase-admin/firestore";
import GetUserFriends from "./GetUserFriends";

interface UserProfile {
  firstname: string;
  lastname: string;
  birthdate: string; // Assuming birthdate is stored in the format 'yyyy-mm-dd'
  photourl: string;
  id: string;
}

interface BirthdayInfo {
  name: string;
  occurrence: string;
  reference: string;
  photourl: string;
  id: string;
}

// ... (previous imports and interfaces remain the same)

export async function getUserFriendsBirthdays(
  uid: string
): Promise<BirthdayInfo[]> {
  try {
    const db = getFirestore(); // Get the Firestore instance

    // Fetch user's friends profiles from Firestore (assuming stored in a 'friends' collection)
    const friendsSnapshot = await GetUserFriends(uid);

    const today = new Date(); // Get today's date
    const todayMonth = today.getMonth() + 1; // Month is zero-based
    const todayDay = today.getDate();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowMonth = tomorrow.getMonth() + 1;
    const tomorrowDay = tomorrow.getDate();

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const dayAfterTomorrowMonth = dayAfterTomorrow.getMonth() + 1;
    const dayAfterTomorrowDay = dayAfterTomorrow.getDate();

    const birthdays: BirthdayInfo[] = [];

    // Iterate through each friend's profile
    friendsSnapshot.forEach((friendDoc) => {
      const userProfile: UserProfile = friendDoc as UserProfile;

      // Check if the friend has a valid birthdate
      if (userProfile.birthdate) {
        const [friendYear, friendMonth, friendDay] = userProfile.birthdate
          .split("-")
          .map(Number);

        if (friendMonth === todayMonth && friendDay === todayDay) {
          birthdays.push({
            name: userProfile.firstname + " " + userProfile.lastname,
            occurrence: "today",
            reference: userProfile.birthdate,
            photourl: userProfile.photourl,
            id: userProfile.id,
          });
        } else if (friendMonth === tomorrowMonth && friendDay === tomorrowDay) {
          birthdays.push({
            name: userProfile.firstname + " " + userProfile.lastname,
            occurrence: "tomorrow",
            reference: userProfile.birthdate,
            photourl: userProfile.photourl,
            id: userProfile.id,
          });
        } else if (
          friendMonth === dayAfterTomorrowMonth &&
          friendDay === dayAfterTomorrowDay
        ) {
          birthdays.push({
            name: userProfile.firstname + " " + userProfile.lastname,
            occurrence: "day after tomorrow",
            reference: userProfile.birthdate,
            photourl: userProfile.photourl,
            id: userProfile.id,
          });
        }
      }
    });

    birthdays.sort((a, b) => {
      if (a.occurrence === b.occurrence) {
        return a.name.localeCompare(b.name);
      }
      const order = ["today", "tomorrow", "day after tomorrow"];
      return order.indexOf(a.occurrence) - order.indexOf(b.occurrence);
    });

    return birthdays;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error fetching user's friends' birthdays: " + error);
  }
}
