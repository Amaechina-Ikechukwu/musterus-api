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
const uuids_1 = __importDefault(require("../../middlewares/uuids"));
const AdminActions_1 = require("./AdminActions");
function CreateGroup(uid, groupInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uuid = (0, uuids_1.default)();
            yield (0, firestore_1.getFirestore)()
                .collection("groups")
                .doc(uuid)
                .collection("groupinfo")
                .doc("info")
                .set(groupInfo)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                yield (0, firestore_1.getFirestore)()
                    .collection("profile")
                    .doc(uid)
                    .collection("groups")
                    .doc(uuid)
                    .set({});
            }));
            yield (0, AdminActions_1.MakeAnAdmin)(uid, uuid);
            return "created";
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error creating group: " + error);
            }
        }
    });
}
exports.default = CreateGroup;
