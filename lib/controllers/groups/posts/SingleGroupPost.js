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
const GetGroupInformation_1 = __importDefault(require("../GetGroupInformation"));
const getuserprofileinformation_1 = __importDefault(require("../../profile/getuserprofileinformation"));
function deleteInfo(data) {
    delete data.password;
    return data;
}
function SingleGroupPost(postid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const grouppost = yield firestore.collection("posts").doc(postid).get();
            const postData = grouppost.data();
            if (!postData) {
                throw new Error("Post data not found");
            }
            const authorID = postData.author;
            const authorProfile = yield (0, getuserprofileinformation_1.default)(authorID);
            const groupID = postData.groupid;
            const groupInfo = yield (0, GetGroupInformation_1.default)(groupID);
            const data = Object.assign(Object.assign({}, postData), { group: groupInfo, author: deleteInfo(authorProfile) });
            return data;
        }
        catch (error) {
            throw new Error("Error retrieving post information: " + error);
        }
    });
}
exports.default = SingleGroupPost;
