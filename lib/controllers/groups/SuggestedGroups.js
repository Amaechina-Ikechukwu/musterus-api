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
function SuggestedGroups(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = (0, firestore_1.getFirestore)(); // Get the Firestore instance
            // Get all documents from the groups collection
            const groupsSnapshot = yield db.collection("groups").get();
            const suggestedGroups = [];
            // Loop through each group document
            groupsSnapshot.forEach((groupDoc) => __awaiter(this, void 0, void 0, function* () {
                const groupId = groupDoc.id;
                // Get reference to the groupInfo document in the groups collection
                const groupInfoRef = db
                    .collection("groups")
                    .doc(groupId)
                    .collection("groupinfo")
                    .doc("info");
                // Fetch the groupInfo document
                const groupInfoDoc = yield groupInfoRef.get();
                if (groupInfoDoc.exists) {
                    const groupInfoData = groupInfoDoc.data();
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
            }));
            return suggestedGroups;
        }
        catch (error) {
            console.error("Error:", error);
            throw new Error("Error fetching user groups: " + error);
        }
    });
}
exports.default = SuggestedGroups;
