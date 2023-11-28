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
const InitializeChat_1 = __importDefault(require("../direcmessages/InitializeChat"));
const GetConversationId_1 = require("../direcmessages/GetConversationId");
const SendMessage_1 = __importDefault(require("../direcmessages/SendMessage"));
const SeenMessage_1 = __importDefault(require("../direcmessages/SeenMessage"));
const firestore_1 = require("firebase-admin/firestore");
const GetUserChatList_1 = require("../direcmessages/GetUserChatList");
class CustomUserProfileError extends Error {
    constructor(message) {
        super(message);
        this.message = "CustomUserProfileError";
    }
}
const dmrouter = (0, express_1.Router)();
//
dmrouter.post("/initializechat", (0, authmiddleware_1.checkRequestBodyParams)(["friendid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { friendid } = req.body;
        const result = yield (0, InitializeChat_1.default)(uid, friendid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        console.log(err);
        return res.json({ error: err });
    }
}));
dmrouter.post("/sendDM", (0, authmiddleware_1.checkRequestBodyParams)(["text", "friendid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { text, friendid, mediaurl, type = "text" } = req.body;
        const conversationid = yield (0, GetConversationId_1.GetConversationId)(uid, friendid);
        const message = {
            author: uid,
            reciever: friendid,
            text,
            mediaurl,
            type,
            sent: firestore_1.FieldValue.serverTimestamp(),
        };
        const result = yield (0, SendMessage_1.default)(conversationid, message);
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
dmrouter.post("/conversationid", (0, authmiddleware_1.checkRequestBodyParams)(["friendid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { friendid } = req.body;
        const result = yield (0, GetConversationId_1.GetConversationId)(uid, friendid);
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
dmrouter.post("/seenDM", (0, authmiddleware_1.checkRequestBodyParams)(["conversationid", "messageid"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { conversationid, messageid } = req.body;
        const result = yield (0, SeenMessage_1.default)(uid, conversationid, messageid);
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
dmrouter.get("/chatlist", verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const result = yield (0, GetUserChatList_1.getUserChatList)(uid);
        res.status(200).json({ chats: result });
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
dmrouter.delete("/deleteuser", verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const result = yield (0, deleteuser_1.DeleteUser)(uid);
        res.status(200).json({ message: result });
    }
    catch (err) {
        throw new Error("Error with deleting user");
    }
}));
exports.default = dmrouter;
