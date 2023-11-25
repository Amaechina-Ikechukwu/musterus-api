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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-admin/firestore");
const getuserprofileinformation_1 = __importDefault(require("../../profile/getuserprofileinformation"));
function SeenMessageToSchoolGroup(messageId, reader) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        try {
            const { school, faculty, department, level } = yield (0, getuserprofileinformation_1.default)(reader);
            // Create a reference to the 'groups' collection
            const groupsRef = firestore.collection("groups");
            // send message to school group
            yield groupsRef
                .doc("schoolGroups")
                .collection(school)
                .doc("chats")
                .collection("chats")
                .doc(messageId)
                .collection("seenBy")
                .doc("members")
                .set({ [reader]: true }, { merge: true });
            return "seen";
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
exports.default = SeenMessageToSchoolGroup;
