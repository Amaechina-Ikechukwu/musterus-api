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
function SuggestedGroups(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = (0, firestore_1.getFirestore)();
            const querySnapshot = yield db.collection("groups").get();
            const filterGroups = (doc) => __awaiter(this, void 0, void 0, function* () {
                console.log(doc);
                const groupID = doc.id;
                try {
                    const data = yield (0, GetGroupInformation_1.default)(groupID);
                    const adminRef = yield db
                        .collection("groups")
                        .doc(groupID)
                        .collection("admins")
                        .doc(uid)
                        .get();
                    const memberRef = yield db
                        .collection("groups")
                        .doc(groupID)
                        .collection("members")
                        .doc(uid)
                        .get();
                    if (!adminRef.exists && !memberRef.exists) {
                        return Object.assign({ groupID }, data);
                    }
                    else {
                        return null;
                    }
                }
                catch (err) {
                    console.error("Error assigning group info:", err);
                    return Promise.reject("Error assigning group info: " + err);
                }
            });
            const groupsPromises = querySnapshot.docs.map(filterGroups);
            const groups = yield Promise.all(groupsPromises.map((p) => p.catch((e) => e)));
            return groups.filter((group) => group !== null);
        }
        catch (error) {
            console.error("Error fetching user groups:", error);
            throw new Error("Error fetching user groups: " + error);
        }
    });
}
exports.default = SuggestedGroups;
