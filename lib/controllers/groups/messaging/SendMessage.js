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
function SendMessageToGroup(uid, groupId, message, media) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        try {
            // Create a reference to the 'groups' collection
            const groupsRef = firestore.collection("groups");
            // send message to school group
            yield groupsRef
                .doc(groupId)
                .collection("chats")
                .doc()
                .set({ from: uid, message, sent: firestore_1.FieldValue.serverTimestamp(), media });
            return "sent";
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
exports.default = SendMessageToGroup;
