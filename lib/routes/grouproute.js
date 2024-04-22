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
const express_1 = require("express");
const verifytoken_1 = require("../middlewares/verifytoken");
const deleteuser_1 = require("../controllers/authentication/deleteuser");
const CreateGroup_1 = __importDefault(require("../controllers/groups/CreateGroup"));
const authmiddleware_1 = require("../middlewares/authmiddleware");
const SendMessage_1 = __importDefault(require("../controllers/groups/messaging/SendMessage"));
const JoinGroup_1 = __importDefault(require("../controllers/groups/JoinGroup"));
const IsUserInGroup_1 = __importDefault(require("../controllers/groups/IsUserInGroup"));
const CreatePost_1 = __importDefault(require("../controllers/groups/posts/CreatePost"));
const UnlikePost_1 = __importDefault(require("../controllers/groups/posts/Actions/UnlikePost"));
const CommentOnPost_1 = __importDefault(require("../controllers/groups/posts/CommentOnPost"));
const LikePost_1 = __importDefault(require("../controllers/groups/posts/Actions/LikePost"));
const GetUsersGroup_1 = __importDefault(require("../controllers/groups/GetUsersGroup"));
const SingleGroupPost_1 = __importDefault(require("../controllers/groups/posts/SingleGroupPost"));
const SavePostToProfile_1 = __importDefault(require("../controllers/groups/posts/SavePostToProfile"));
const GetFullGroupInformation_1 = __importDefault(require("../controllers/groups/GetFullGroupInformation"));
const GetAllGroupPost_1 = __importDefault(require("../controllers/groups/posts/GetAllGroupPost"));
const AdminActions_1 = require("../controllers/groups/AdminActions");
const UpdateGroup_1 = __importDefault(require("../controllers/groups/UpdateGroup"));
const SuggestedGroups_1 = __importDefault(require("../controllers/groups/SuggestedGroups"));
const AddUserToGroup_1 = __importDefault(require("../controllers/groups/AddUserToGroup"));
class CustomUserProfileError extends Error {
    constructor(message) {
        super(message);
        this.message = "CustomUserProfileError";
    }
}
const grouprouter = (0, express_1.Router)();
//
grouprouter.get("/mygroups", verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const result = yield (0, GetUsersGroup_1.default)(uid);
        res.status(200).json({ groups: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.get("/", verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const result = yield (0, SuggestedGroups_1.default)(uid);
        res.status(200).json({ groups: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/creategroup", (0, authmiddleware_1.checkRequestBodyParams)(["name", "description", "photourl"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { name, photourl, description } = req.body;
        const groupInfo = { name, photourl, description, admin: uid };
        const result = yield (0, CreateGroup_1.default)(uid, groupInfo);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/updategroup", (0, authmiddleware_1.checkRequestBodyParams)(["name", "description", "photourl", "groupid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { name, photourl, description, groupid } = req.body;
        const groupInfo = { name, photourl, description, admin: uid };
        const result = yield (0, UpdateGroup_1.default)(uid, groupid, groupInfo);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/message", (0, authmiddleware_1.checkRequestBodyParams)(["message", "groupid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { message, groupid, mediaurl } = req.body;
        const result = yield (0, SendMessage_1.default)(uid, groupid, message, mediaurl);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/joingroup", (0, authmiddleware_1.checkRequestBodyParams)(["groupid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { groupid } = req.body;
        const result = yield (0, JoinGroup_1.default)(uid, groupid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/addusertogroup", (0, authmiddleware_1.checkRequestBodyParams)(["groupid", "friendid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { groupid, friendid } = req.body;
        const result = yield (0, AddUserToGroup_1.default)(uid, groupid, friendid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        return res.status(401).json({ error: err });
    }
}));
grouprouter.post("/isuseringroup", (0, authmiddleware_1.checkRequestBodyParams)(["groupid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { groupid } = req.body;
        const result = yield (0, IsUserInGroup_1.default)(uid, groupid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/createpost", (0, authmiddleware_1.checkRequestBodyParams)(["groupid", "caption"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { groupid, mediaurl, caption } = req.body;
        const postinfo = { caption, mediaurl };
        const result = yield (0, CreatePost_1.default)(uid, groupid, postinfo);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/likepost", (0, authmiddleware_1.checkRequestBodyParams)(["postid", "action"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { postid, action } = req.body;
        const result = yield (0, LikePost_1.default)(uid, postid, action);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/unlikepost", (0, authmiddleware_1.checkRequestBodyParams)(["postid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { postid } = req.body;
        const result = yield (0, UnlikePost_1.default)(uid, postid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/commentonpost", (0, authmiddleware_1.checkRequestBodyParams)(["postid", "comment"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { comment, postid } = req.body;
        const result = yield (0, CommentOnPost_1.default)(uid, comment, postid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/singlegrouppost", (0, authmiddleware_1.checkRequestBodyParams)(["postid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postid } = req.body;
        const result = yield (0, SingleGroupPost_1.default)(postid);
        res.status(200).json({ data: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/savetoprofile", (0, authmiddleware_1.checkRequestBodyParams)(["postid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { postid } = req.body;
        const result = yield (0, SavePostToProfile_1.default)(uid, postid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/fullgroupinfo", (0, authmiddleware_1.checkRequestBodyParams)(["groupid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupid } = req.body;
        const result = yield (0, GetFullGroupInformation_1.default)(groupid);
        res.status(200).json({ data: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/groupposts", (0, authmiddleware_1.checkRequestBodyParams)(["groupid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupid } = req.body;
        const result = yield (0, GetAllGroupPost_1.default)(groupid);
        res.status(200).json({ data: result });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/makeuseradmin", (0, authmiddleware_1.checkRequestBodyParams)(["groupid", "userid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { groupid, userid } = req.body;
        const admin = yield (0, AdminActions_1.IsUserGroupAdmin)(uid, groupid);
        if (admin) {
            const result = yield (0, AdminActions_1.MakeAnAdmin)(userid, groupid);
            res.status(200).json({ message: result });
        }
        else {
            res.status(401).json({ message: "You dont have admin permissions" });
        }
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/isuseradmin", (0, authmiddleware_1.checkRequestBodyParams)(["groupid", "userid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { groupid, userid } = req.body;
        const admin = yield (0, AdminActions_1.IsUserGroupAdmin)(userid, groupid);
        res.status(200).json({ message: admin });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.post("/listofadmins", (0, authmiddleware_1.checkRequestBodyParams)(["groupid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupid } = req.body;
        const admin = yield (0, AdminActions_1.GetListOfAdmins)(groupid);
        res.status(200).json({ message: admin });
    }
    catch (err) {
        if (err instanceof CustomUserProfileError) {
            return res.status(400).json({ error: err.message });
        }
        else if (err instanceof Error) {
            // Handle other specific errors as needed
            return res.status(500).json({ error: err });
        }
        return res.json({ error: err });
    }
}));
grouprouter.delete("/deleteuser", verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const result = yield (0, deleteuser_1.DeleteUser)(uid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        throw new Error("Error with deleting user");
    }
}));
exports.default = grouprouter;
