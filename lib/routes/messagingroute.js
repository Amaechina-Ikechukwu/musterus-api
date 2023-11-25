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
const authmiddleware_1 = require("../middlewares/authmiddleware");
const verifytoken_1 = require("../middlewares/verifytoken");
const seenby_1 = __importDefault(require("../controllers/groups/messaging/seenby"));
class CustomUserProfileError extends Error {
    constructor(message) {
        super(message);
        this.message = "CustomUserProfileError";
    }
}
const messagingRouter = (0, express_1.Router)();
//
messagingRouter.post("/message/seenschoolgroupmessage", (0, authmiddleware_1.checkRequestBodyParams)(["messageId"]), verifytoken_1.VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.uid;
        const { messageId, reader } = req.body;
        const result = yield (0, seenby_1.default)(messageId, uid);
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
exports.default = messagingRouter;
