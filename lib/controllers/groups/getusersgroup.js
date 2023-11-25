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
const GetGroupInformation_1 = __importDefault(require("./GetGroupInformation"));
function GetUsersGroup(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const querySnapshot = yield (0, firestore_1.getFirestore)()
                .collection("profile")
                .doc(uid)
                .collection("groups")
                .get();
            const groups = yield Promise.all(querySnapshot.docs.map((doc) => __awaiter(this, void 0, void 0, function* () {
                const groupID = doc.id;
                try {
                    const data = yield (0, GetGroupInformation_1.default)(groupID);
                    return { groupID, data };
                }
                catch (err) {
                    throw new Error("Error assigning group info: " + err);
                }
            })));
            return groups;
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching user groups: " + error);
            }
        }
    });
}
exports.default = GetUsersGroup;
