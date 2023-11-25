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
const express_1 = __importDefault(require("express"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const authroute_1 = __importDefault(require("./routes/authroute"));
const profileroute_1 = __importDefault(require("./routes/profileroute"));
const grouproute_1 = __importDefault(require("./routes/grouproute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize Firebase app
        const serviceAccount = require("../x.json"); // Replace with your actual service account file path
        (0, app_1.initializeApp)({
            credential: (0, app_1.cert)(serviceAccount),
        });
        // Get Firestore instance
        const firestore = (0, firestore_1.getFirestore)();
        firestore.settings({
            ignoreUndefinedProperties: true,
        });
        // Set up routes
        app.use("/auth", authroute_1.default);
        app.use("/profile", profileroute_1.default);
        app.use("/groups", grouproute_1.default);
        // Start the server
        const PORT = process.env.PORT || 3004;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        // Error handling
        app.use((err, req, res, next) => {
            res.status(400).json({ error: err.message });
        });
    }
    catch (error) {
        console.error("Firebase initialization error:", error);
    }
}))();
