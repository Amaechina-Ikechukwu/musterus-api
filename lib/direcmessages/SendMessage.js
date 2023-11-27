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
function SendMessage(conversationid, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        try {
            // Create a reference to the 'direct_messages' collection
            const messagesRef = firestore
                .collection("direct_messages")
                .doc(conversationid)
                .collection("messages");
            // Validate message type
            if (!["text", "image", "audio", "video"].includes(message.type)) {
                throw new Error("Invalid message type: " + message.type);
            }
            // Add the message to the conversation subcollection
            yield messagesRef.add(message);
            const participants = conversationid.split("_");
            // Update participants in a separate collection (if needed)
            yield firestore
                .collection("direct_messages")
                .doc(conversationid)
                .set({ participants }); // Set participants directly in the conversation document
            return "messageSent";
        }
        catch (error) {
            console.error("Error sending message:", error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error sending message: " + error);
            }
        }
    });
}
exports.default = SendMessage;
