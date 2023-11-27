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
function GetUsersPosts(groupid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const querySnapshot = yield firestore
                .collection("posts")
                .where("author", "in", groupid)
                .get();
            const posts = yield Promise.all(querySnapshot.docs.map((doc) => __awaiter(this, void 0, void 0, function* () {
                const postid = doc.id;
                try {
                    const postData = doc.data();
                    return Object.assign({ postid }, postData);
                }
                catch (err) {
                    throw new Error("Error assigning group info: " + err);
                }
            })));
            return posts;
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching group posts: " + error);
            }
        }
    });
}
exports.default = GetUsersPosts;
