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
const getuserprofileinformation_1 = __importDefault(require("../profile/getuserprofileinformation"));
function removeFieldsFromUserProfile(userProfile) {
    delete userProfile.metadata;
    delete userProfile.providerData;
    delete userProfile.lastUpdated;
    delete userProfile.tokensValidAfterTime;
    delete userProfile.disabled;
    return userProfile;
}
function GetSameSchool(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { school } = yield (0, getuserprofileinformation_1.default)(uid);
            const firestore = (0, firestore_1.getFirestore)();
            const snapshot = yield firestore
                .collection("profile")
                .where("school", "==", school)
                .where("uid", "!=", uid)
                .get();
            if (snapshot.empty) {
                return [];
            }
            const profiles = [];
            snapshot.forEach((doc) => {
                const userProfile = removeFieldsFromUserProfile(doc.data());
                profiles.push(userProfile);
            });
            return profiles;
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching user profiles: " + error);
            }
        }
    });
}
exports.default = GetSameSchool;
