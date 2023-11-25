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
exports.VerifyToken = void 0;
const firebase_admin_1 = require("firebase-admin");
const VerifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authorizationHeader.split("Bearer ")[1];
        if (!token || token.length < 5) {
            return res.status(401).json({ error: "Invalid token" });
        }
        yield (0, firebase_admin_1.auth)()
            .getUser(token)
            .then((userRecord) => {
            req.uid = token;
            next();
        })
            .catch((error) => {
            return res.status(401).json({ error: error });
        });
        // Adding the UID to the request object for future use in the route handlers
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Invalid token" });
    }
});
exports.VerifyToken = VerifyToken;
