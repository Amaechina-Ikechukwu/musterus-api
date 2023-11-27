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
exports.GetConversationId = void 0;
const firestore_1 = require("firebase-admin/firestore");
function GetConversationId(friendId, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        try {
            // Create a reference to the 'conversationIDs' collection
            const conversationRef = firestore.collection("conversationIDS");
            // Query for conversations where both participants are present
            const conversationQuery = yield conversationRef
                .where("participants", "array-contains", uid)
                .where("participants", "array-contains", friendId)
                .get();
            if (!conversationQuery.empty) {
                // If conversations are found, return the first conversation ID
                console.log(conversationQuery.docs);
                return conversationQuery.docs[0].id;
            }
            else {
                // Return null if the conversation doesn't exist
                return null;
            }
        }
        catch (error) {
            console.error("Error fetching conversation ID:", error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching conversation ID: " + error);
            }
        }
    });
}
exports.GetConversationId = GetConversationId;
