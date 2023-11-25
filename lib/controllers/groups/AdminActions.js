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
exports.IsUserGroupAdmin = exports.GetListOfAdmins = exports.MakeAnAdmin = void 0;
const firestore_1 = require("firebase-admin/firestore");
const getuserprofileinformation_1 = __importDefault(require("../profile/getuserprofileinformation"));
function MakeAnAdmin(uid, groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const groupRef = firestore.collection("groups").doc(groupid);
            const memberRef = groupRef.collection("admins");
            const memberDoc = yield memberRef.doc(uid).get();
            if (!memberDoc.exists) {
                yield memberRef.doc(uid).set({}); // Promote user to admin
                return "joined as admin";
            }
            else {
                // User is already an admin
                return "user is already an admin in this group";
            }
        }
        catch (error) {
            console.log(error);
            throw new Error("Error promoting user to admin: " + error);
        }
    });
}
exports.MakeAnAdmin = MakeAnAdmin;
function GetListOfAdmins(groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const groupRef = firestore.collection("groups").doc(groupid);
            const adminsRef = groupRef.collection("admins");
            const adminsSnapshot = yield adminsRef.get();
            const adminListPromises = [];
            adminsSnapshot.forEach((doc) => {
                const userPromise = (0, getuserprofileinformation_1.default)(doc.id)
                    .then((user) => {
                    // Sanitize sensitive information
                    delete user.password;
                    return user;
                })
                    .catch((error) => {
                    console.error(`Error fetching user profile for ${doc.id}: ${error}`);
                    return null;
                });
                adminListPromises.push(userPromise);
            });
            const adminList = yield Promise.all(adminListPromises);
            return adminList.filter((user) => user !== null);
        }
        catch (error) {
            console.error("Error getting list of admins:", error);
            throw new Error("Error getting list of admins: " + error);
        }
    });
}
exports.GetListOfAdmins = GetListOfAdmins;
function IsUserGroupAdmin(uid, groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const groupRef = firestore.collection("groups").doc(groupid);
            const adminRef = groupRef.collection("admins").doc(uid);
            const adminDoc = yield adminRef.get();
            return adminDoc.exists;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error checking if user is group admin: " + error);
        }
    });
}
exports.IsUserGroupAdmin = IsUserGroupAdmin;
