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
const authmiddleware_1 = require("../middlewares/authmiddleware");
const CreatePost_1 = __importDefault(require("../controllers/home/CreatePost"));
const LikePost_1 = __importDefault(require("../controllers/home/Actions/LikePost"));
const UnlikePost_1 = __importDefault(require("../controllers/home/Actions/UnlikePost"));
const CommentOnPost_1 = __importDefault(require("../controllers/home/CommentOnPost"));
const Singlepost_1 = __importDefault(require("../controllers/home/Singlepost"));
const SavePostToProfile_1 = __importDefault(require("../controllers/home/SavePostToProfile"));
const GetAllUserPost_1 = __importDefault(require("../controllers/home/GetAllUserPost"));
const DeletePost_1 = __importDefault(require("../controllers/home/DeletePost"));
class CustomUserProfileError extends Error {
    constructor(message) {
        super(message);
        this.message = "CustomUserProfileError";
    }
}
const homerouter = (0, express_1.Router)();
//
homerouter.post("/createpost", (0, authmiddleware_1.checkRequestBodyParams)(["caption"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { mediaurl, caption } = req.body;
        const postinfo = { caption, mediaurl };
        const result = yield (0, CreatePost_1.default)(uid, postinfo);
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
homerouter.post("/deletepost", verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { postid } = req.body;
        const result = yield (0, DeletePost_1.default)(uid, postid);
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
homerouter.post("/likepost", (0, authmiddleware_1.checkRequestBodyParams)(["postid", "action"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
homerouter.post("/unlikepost", (0, authmiddleware_1.checkRequestBodyParams)(["postid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
homerouter.post("/commentonpost", (0, authmiddleware_1.checkRequestBodyParams)(["postid", "comment"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
homerouter.post("/singlepost", (0, authmiddleware_1.checkRequestBodyParams)(["postid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postid } = req.body;
        const result = yield (0, Singlepost_1.default)(postid);
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
homerouter.post("/savetoprofile", (0, authmiddleware_1.checkRequestBodyParams)(["postid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
homerouter.get("/posts", verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const result = yield (0, GetAllUserPost_1.default)(uid);
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
homerouter.delete("/deleteuser", verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const result = yield (0, deleteuser_1.DeleteUser)(uid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        throw new Error("Error with deleting user");
    }
}));
exports.default = homerouter;
