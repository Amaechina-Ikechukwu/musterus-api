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
const getuserprofileinformation_1 = __importDefault(require("./getuserprofileinformation"));
const AmIFollowing_1 = __importDefault(require("./AmIFollowing"));
function removeFieldsFromUserProfile(userProfile) {
    delete userProfile.password;
    return userProfile;
}
function GetSuggestedUsers(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const friendsCollection = yield firestore.collection("profile").get();
            const suggestedUser = [];
            if (friendsCollection.empty) {
                return []; // Return an empty array if the user has no friends
            }
            else {
                // Retrieve each friend's data and determine if the user is following them
                const friendsDataPromises = friendsCollection.docs.map((friendDoc) => __awaiter(this, void 0, void 0, function* () {
                    if (friendDoc.id !== uid) {
                        const friendId = friendDoc.id;
                        const userData = yield (0, getuserprofileinformation_1.default)(friendId);
                        const isFollowing = yield (0, AmIFollowing_1.default)(uid, friendId);
                        const friendWithFollowing = Object.assign(Object.assign({ id: friendId }, userData), { isFollowing });
                        suggestedUser.push(friendWithFollowing);
                    }
                }));
                yield Promise.all(friendsDataPromises); // Wait for all promises to resolve
                return suggestedUser;
            }
        }
        catch (error) {
            console.error("Error fetching user's friends:", error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching user's friends: " + error);
            }
        }
    });
}
exports.default = GetSuggestedUsers;
