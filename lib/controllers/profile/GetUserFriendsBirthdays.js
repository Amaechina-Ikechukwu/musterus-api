"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFriendsBirthdays = void 0;
const firestore_1 = require("firebase-admin/firestore");
const GetUserFriends_1 = __importDefault(require("./GetUserFriends"));
// ... (previous imports and interfaces remain the same)
function getUserFriendsBirthdays(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = (0, firestore_1.getFirestore)(); // Get the Firestore instance
            // Fetch user's friends profiles from Firestore (assuming stored in a 'friends' collection)
            const friendsSnapshot = yield (0, GetUserFriends_1.default)(uid);
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
            const birthdays = [];
            // Iterate through each friend's profile
            friendsSnapshot.forEach((friendDoc) => {
                const userProfile = friendDoc;
                // Check if the friend has a valid birthdate
                if (userProfile.birthdate) {
                    const [friendYear, friendMonth, friendDay] = userProfile.birthdate
                        .split("-")
                        .map(Number);
                    if (friendMonth === todayMonth && friendDay === todayDay) {
                        birthdays.push({
                            name: userProfile.name,
                            occurrence: "today",
                            reference: userProfile.birthdate,
                            photourl: userProfile.photourl,
                        });
                    }
                    else if (friendMonth === tomorrowMonth && friendDay === tomorrowDay) {
                        birthdays.push({
                            name: userProfile.name,
                            occurrence: "tomorrow",
                            reference: userProfile.birthdate,
                            photourl: userProfile.photourl,
                        });
                    }
                    else if (friendMonth === dayAfterTomorrowMonth &&
                        friendDay === dayAfterTomorrowDay) {
                        birthdays.push({
                            name: userProfile.name,
                            occurrence: "day after tomorrow",
                            reference: userProfile.birthdate,
                            photourl: userProfile.photourl,
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
        }
        catch (error) {
            console.error("Error:", error);
            throw new Error("Error fetching user's friends' birthdays: " + error);
        }
    });
}
exports.getUserFriendsBirthdays = getUserFriendsBirthdays;
