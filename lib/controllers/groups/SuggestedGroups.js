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
const GetGroupInformation_1 = __importDefault(require("./GetGroupInformation"));
function SuggestedGroups(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const querySnapshot = yield (0, firestore_1.getFirestore)().collection("groups").get();
            const groups = yield Promise.all(querySnapshot.docs.map((doc) => __awaiter(this, void 0, void 0, function* () {
                const groupID = doc.id;
                try {
                    const data = yield (0, GetGroupInformation_1.default)(groupID);
                    // Check if the UID exists in either 'admin' or 'members' collection
                    const adminRef = (0, firestore_1.getFirestore)()
                        .collection("groups")
                        .doc(groupID)
                        .collection("admins")
                        .doc(uid);
                    const memberRef = (0, firestore_1.getFirestore)()
                        .collection("groups")
                        .doc(groupID)
                        .collection("members")
                        .doc(uid);
                    const [isAdmin, isMember] = yield Promise.all([
                        adminRef.get(),
                        memberRef.get(),
                    ]);
                    if (!isAdmin.exists && !isMember.exists) {
                        return { groupID, data };
                    }
                    else {
                        return null; // If UID exists in admin or members, don't include this group
                    }
                }
                catch (err) {
                    throw new Error("Error assigning group info: " + err);
                }
            })));
            // Filter out null entries (groups where the user exists as admin or member)
            return groups.filter((group) => group !== null);
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching user groups: " + error);
            }
        }
    });
}
exports.default = SuggestedGroups;
