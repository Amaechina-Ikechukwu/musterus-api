"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { initializeApp, applicationDefault, cert, } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue, Filter, } = require("firebase-admin/firestore");
const authroute_1 = __importDefault(require("./routes/authroute"));
const profileroute_1 = __importDefault(require("./routes/profileroute"));
const messagingroute_1 = __importDefault(require("./routes/messagingroute"));
//loads the documentation file
const app = (0, express_1.default)();
app.use(express_1.default.json());
var admin = require("firebase-admin");
var serviceAccount = require("../x.json");
//initializes firebase
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
initializeApp({
    credential: cert(serviceAccount),
});
getFirestore().settings({
    ignoreUndefinedProperties: true,
});
// automatic documentation displayed on postman
app.use("/auth", authroute_1.default);
app.use("/profile", profileroute_1.default);
app.use("/groups", messagingroute_1.default);
app.listen(3004, () => console.log("this is Kallum"));
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});
exports.default = app;
