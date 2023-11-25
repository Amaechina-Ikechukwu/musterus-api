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
function JoinGroup(uid, groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const groupRef = firestore.collection("groups").doc(groupid);
            const memberRef = groupRef.collection("members").doc(uid);
            const memberDoc = yield memberRef.get();
            if (!memberDoc.exists) {
                yield memberRef.set({}).then((result) => __awaiter(this, void 0, void 0, function* () {
                    yield (0, firestore_1.getFirestore)()
                        .collection("profile")
                        .doc(uid)
                        .collection("groups")
                        .doc(groupid)
                        .set({});
                }));
                return "joined";
            }
            else {
                // Update the existing document
                return "user is already in this group";
            }
        }
        catch (error) {
            console.log(error);
            throw new Error("Error joining group: " + error);
        }
    });
}
exports.default = JoinGroup;
