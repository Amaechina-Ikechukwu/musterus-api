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
const GetUserFriends_1 = __importDefault(require("../profile/GetUserFriends"));
const getuserprofileinformation_1 = __importDefault(require("../profile/getuserprofileinformation"));
function GetUsersPosts(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const userFriends = yield (0, GetUserFriends_1.default)(uid);
            const query = firestore.collection("posts");
            // Create a query to fetch posts by user's friends or the user themselves
            const querySnapshot = yield query
                .where("author", "in", [...userFriends, uid]) // Ensure userFriends is an array of UIDs
                .orderBy("createdAt", "desc")
                .get();
            const postsPromises = querySnapshot.docs.map((doc) => __awaiter(this, void 0, void 0, function* () {
                const postid = doc.id;
                const postData = doc.data();
                const authorinfo = yield (0, getuserprofileinformation_1.default)(postData.author);
                return Object.assign(Object.assign({ postid }, postData), { authorinfo });
            }));
            // Wait for all the promises to resolve
            const posts = yield Promise.all(postsPromises);
            return posts;
        }
        catch (error) {
            console.error("Error fetching posts:", error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error fetching posts: " + error);
            }
        }
    });
}
exports.default = GetUsersPosts;
