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
const firestore_1 = require("firebase-admin/firestore");
const GetGroupInformation_1 = __importDefault(require("../groups/GetGroupInformation"));
const getuserprofileinformation_1 = __importDefault(require("./getuserprofileinformation"));
function removeFieldsFromUserProfile(userProfile) {
    delete userProfile.password;
    delete userProfile.lastUpdated;
    return userProfile;
}
function GetUserFullProfileInformation(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userDoc = yield (0, firestore_1.getFirestore)().collection("profile").doc(uid).get();
            if (!userDoc.exists) {
                return "No such document!";
            }
            else {
                const user = userDoc.data();
                const followingSnapshot = yield (0, firestore_1.getFirestore)()
                    .collection("profile")
                    .doc(uid)
                    .collection("following")
                    .get();
                const followersSnapshot = yield (0, firestore_1.getFirestore)()
                    .collection("profile")
                    .doc(uid)
                    .collection("followers")
                    .get();
                const followingCount = followingSnapshot.size;
                const followersCount = followersSnapshot.size;
                const followingUsers = [];
                const followersUsers = [];
                // Fetch user information for each document ID in following collection
                for (const followingDoc of followingSnapshot.docs) {
                    const followingUser = yield (0, getuserprofileinformation_1.default)(followingDoc.id);
                    followingUsers.push(followingUser);
                }
                // Fetch user information for each document ID in followers collection
                for (const followerDoc of followersSnapshot.docs) {
                    const followerUser = yield (0, getuserprofileinformation_1.default)(followerDoc.id);
                    followersUsers.push(followerUser);
                }
                const groupInfo = yield (0, GetGroupInformation_1.default)(uid); // Fetch group info for the given UID (assuming UID represents a group ID)
                return {
                    user: removeFieldsFromUserProfile(user),
                    followingCount,
                    followersCount,
                    followingUsers,
                    followersUsers,
                    groupInfo,
                };
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching user profile information: " + error);
            }
        }
    });
}
exports.default = GetUserFullProfileInformation;
