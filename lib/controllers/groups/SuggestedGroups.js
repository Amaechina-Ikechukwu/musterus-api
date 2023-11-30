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
    // Fetch the groupInfo document
    const groupInfoDoc = yield groupInfoRef.get();
    return groupInfoDoc;
});
function SuggestedGroups(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = (0, firestore_1.getFirestore)(); // Get the Firestore instance
            // Get all documents from the groups collection
            const groupsSnapshot = yield db.collection("groups").get();
            const suggestedGroups = [];
            const allGroupIds = []; // Array to store all group ids
            console.log(groupsSnapshot.size);
            // Store all group IDs in an array
            groupsSnapshot.forEach((groupDoc) => {
                const groupId = groupDoc.id;
                allGroupIds.push(groupId);
                console.log(groupId); // Log each group id
            });
            console.log(allGroupIds); // Log all group ids here
            // Iterate through each group ID
            for (const groupId of allGroupIds) {
                const groupInfoDoc = yield getGroupInfo(groupId);
                // Get reference to the groupInfo document in the groups collection
                if (groupInfoDoc.exists) {
                    const groupInfoData = groupInfoDoc.data();
                    const groupInfoRef = (0, firestore_1.getFirestore)().collection("groups").doc(groupId);
                    // Check if the user is in the admins collection
                    const adminDoc = yield groupInfoRef.collection("admins").doc(uid).get();
                    if (adminDoc.exists) {
                        // User is an admin in the group
                        suggestedGroups.push({ groupId, role: "admin" });
                        console.log(`${uid} is an admin in the group ${groupId}`);
                    }
                    else {
                        // Check if the user is in the members collection
                        const memberDoc = yield groupInfoRef
                            .collection("members")
                            .doc(uid)
                            .get();
                        if (memberDoc.exists) {
                            // User is a member in the group
                            suggestedGroups.push({ groupId, role: "member" });
                            console.log(`${uid} is a member in the group ${groupId}`);
                        }
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
