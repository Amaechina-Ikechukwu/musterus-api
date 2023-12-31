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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-admin/firestore");
const getuserprofileinformation_1 = __importDefault(require("./getuserprofileinformation"));
function removeFieldsFromUserProfile(userProfile) {
    const { password } = userProfile, rest = __rest(userProfile, ["password"]);
    return rest;
}
function GetUserFriends(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const friendsCollection = yield (0, firestore_1.getFirestore)()
                .collection("profile")
                .doc(uid)
                .collection("following")
                .get();
            if (friendsCollection.empty) {
                return []; // Return an empty array if the user has no friends
            }
            else {
                const friendInfo = [];
                // Map through the friends collection and retrieve each friend's data
                for (const friendDoc of friendsCollection.docs) {
                    const friend = yield (0, getuserprofileinformation_1.default)(friendDoc.id);
                    friendInfo.push(Object.assign({ id: friendDoc.id }, friend));
                }
                return friendInfo;
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
exports.default = GetUserFriends;
