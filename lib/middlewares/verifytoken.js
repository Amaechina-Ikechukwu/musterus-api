"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const VerifyToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authorizationHeader.split("Bearer ")[1];
        if (!token || token.length < 5) {
            return res.status(401).json({ error: "Invalid token" });
        }
        // Adding the UID to the request object for future use in the route handlers
        req.uid = token;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.VerifyToken = VerifyToken;
