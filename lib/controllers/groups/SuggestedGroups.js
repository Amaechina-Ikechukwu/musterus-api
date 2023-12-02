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
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-admin/firestore");
// ... (other imports and functions)
const getGroupInfo = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const groupInfoRef = (0, firestore_1.getFirestore)()
        .collection("groups")
        .doc(groupId)
        .collection("groupinfo")
        .doc("info");
    const groupInfoDoc = yield groupInfoRef.get();
    return groupInfoDoc;
});
function SuggestedGroups(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = (0, firestore_1.getFirestore)();
            const groupsSnapshot = yield db
                .collectionGroup("groups")
                .get();
            const suggestedGroups = [];
            for (const groupDoc of groupsSnapshot.docs) {
                const groupId = groupDoc.id;
                const groupInfoDoc = yield getGroupInfo(groupId);
                if (groupInfoDoc.exists) {
                    const groupInfoData = groupInfoDoc.data();
                    const groupInfoRef = db.collection("groups").doc(groupId);
                    // Check if the user is an admin or member in the group
                    const adminDoc = yield groupInfoRef.collection("admins").doc(uid).get();
                    const memberDoc = yield groupInfoRef
                        .collection("members")
                        .doc(uid)
                        .get();
                    if (adminDoc.exists || memberDoc.exists) {
                        // User is neither an admin nor a member in the group
                        continue; // Skip this group, proceed to the next one
                    }
                    let role = "";
                    if (adminDoc.exists) {
                        role = "admin";
                    }
                    else if (memberDoc.exists) {
                        role = "member";
                    }
                    suggestedGroups.push({
                        groupId,
                        role,
                        group: groupInfoData,
                    });
                }
                else {
                    console.log(`Group info for ${groupId} does not exist.`);
                }
            }
            return suggestedGroups;
        }
        catch (error) {
            console.error("Error:", error);
            throw new Error("Error fetching user groups: " + error);
        }
    });
}
exports.default = SuggestedGroups;
