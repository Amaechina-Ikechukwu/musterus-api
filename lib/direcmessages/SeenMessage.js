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
function SeenMessage(uid, conversationid, messageid) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        try {
            // Create a reference to the 'groups' collection
            const groupsRef = firestore.collection("direct_messages");
            // Check if the uid exists in the 'seenby' collection for the given message
            const seenByRef = groupsRef
                .doc(conversationid)
                .collection("messages")
                .doc(messageid)
                .collection("seenby")
                .doc(uid);
            const docSnapshot = yield seenByRef.get();
            if (!docSnapshot.exists) {
                // If the uid doesn't exist, set it in the 'seenby' collection
                yield seenByRef.set({ timestamp: firestore_1.FieldValue.serverTimestamp() });
                return "seen";
            }
            else {
                return "alreadySeen";
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error adding user to database" + error);
            }
        }
    });
}
exports.default = SeenMessage;
