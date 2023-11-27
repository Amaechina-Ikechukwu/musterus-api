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
exports.getUserChatList = void 0;
const firestore_1 = require("firebase-admin/firestore");
function getUserChatList(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        try {
            const conversationsSnapshot = yield firestore
                .collection("direct_messages")
                .where("participants", "array-contains", uid)
                .get();
            const chatList = [];
            conversationsSnapshot.forEach((conversationDoc) => {
                const conversationData = conversationDoc.data();
                const participants = conversationData.participants;
                const conversationId = conversationDoc.id;
                const lastMessage = conversationData.lastMessage || null; // Change this if you store last message info
                const conversation = {
                    conversationId,
                    participants,
                    lastMessage,
                };
                chatList.push(conversation);
            });
            return chatList;
        }
        catch (error) {
            console.error("Error fetching user's chat list:", error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching user's chat list: " + error);
            }
        }
    });
}
exports.getUserChatList = getUserChatList;
