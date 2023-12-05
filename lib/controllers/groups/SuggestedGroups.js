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
const getGroupInfo = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const groupInfoRef = (0, firestore_1.getFirestore)()
        .collection("groups")
        .doc(groupId)
        .collection("groupinfo")
        .doc("info");
    const groupInfoDoc = yield groupInfoRef.get();
    return groupInfoDoc;
});
// Existing imports and functions...
function SuggestedGroups(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = (0, firestore_1.getFirestore)();
            const groupsSnapshot = yield db.collectionGroup("groups").get();
            const suggestedGroups = [];
            const uniqueGroupIds = new Set(); // Track unique group IDs
            for (const groupDoc of groupsSnapshot.docs) {
                const groupId = groupDoc.id;
                // Check if the group ID is already processed
                if (uniqueGroupIds.has(groupId)) {
                    continue; // Skip already processed group
                }
                const groupInfoDoc = yield getGroupInfo(groupId);
                if (groupInfoDoc.exists) {
                    const groupInfoData = groupInfoDoc.data();
                    const groupInfoRef = db.collection("groups").doc(groupId);
                    // Check if the user is an admin in the group
                    const adminDoc = yield groupInfoRef.collection("admins").doc(uid).get();
                    // Check if the user is a member in the group
                    const memberDoc = yield groupInfoRef
                        .collection("members")
                        .doc(uid)
                        .get();
                    if (!adminDoc.exists && !memberDoc.exists) {
                        // User is neither an admin nor a member in the group
                        suggestedGroups.push({
                            groupId,
                            group: groupInfoData,
                        });
                        uniqueGroupIds.add(groupId); // Add group ID to the set
                    }
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
