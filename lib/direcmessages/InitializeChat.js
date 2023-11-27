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
function InitializeChat(uid, friendid) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        try {
            // Create a reference to the 'direct messages' collection
            const messagesRef = firestore.collection("conversationIDS");
            // Create a conversation document ID by concatenating user IDs
            const conversationId = [uid, friendid].sort().join("_");
            // Check if the conversation exists in 'direct messages'
            const conversationSnapshot = yield messagesRef.doc(conversationId).get();
            if (!conversationSnapshot.exists) {
                // If the conversation doesn't exist, create it
                yield messagesRef
                    .doc(conversationId)
                    .set({ participants: [uid, friendid] });
                return "chatInitialized";
            }
            else {
                return "chatExists";
            }
        }
        catch (error) {
            console.log(error);
            throw new Error("Error initializing chat" + error);
        }
    });
}
exports.default = InitializeChat;
