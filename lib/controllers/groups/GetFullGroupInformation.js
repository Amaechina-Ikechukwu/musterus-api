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
const getuserprofileinformation_1 = __importDefault(require("../profile/getuserprofileinformation"));
function getInfo(groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        const snapshot = yield firestore
            .collection("groups")
            .doc(groupid)
            .collection("groupinfo")
            .doc("info")
            .get();
        if (!snapshot.exists) {
            return [];
        }
        else {
            return snapshot.data();
        }
    });
}
function getNumberOfMembers(groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const docRef = firestore
                .collection("groups")
                .doc(groupid)
                .collection("members");
            const snapshot = yield docRef.get();
            if (snapshot.empty) {
                return [];
            }
            else {
                const membersData = snapshot.docs.map((doc) => __awaiter(this, void 0, void 0, function* () {
                    return (0, getuserprofileinformation_1.default)(doc.id).then((result) => {
                        return result;
                    });
                }));
                return membersData;
            }
        }
        catch (error) {
            console.error("Error getting number of members:", error);
            throw new Error("Error getting number of members");
        }
    });
}
function getNumberOfPost(groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        const snapshot = yield firestore
            .collection("posts")
            .where("groupid", "==", groupid)
            .get();
        if (!snapshot.docs) {
            return [];
        }
        else {
            return snapshot.size;
        }
    });
}
function GetFullGroupInfo(groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                group: yield getInfo(groupid),
                members: yield getNumberOfMembers(groupid),
                posts: yield getNumberOfPost(groupid),
            };
            return data;
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching groupinfo: " + error);
            }
        }
    });
}
exports.default = GetFullGroupInfo;
