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
exports.initializeprofile = void 0;
const axios_1 = __importDefault(require("axios"));
const firebase_admin_1 = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
const api = axios_1.default.create({
    baseURL: "https://www.musterus.com", // Replace with your API base URL
});
const initializeprofile = (mykey, mskl, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.get(`/ws/myprofile?mykey=${mykey}&mskl=${mskl}`);
        const firestore = (0, firestore_1.getFirestore)();
        yield (0, firebase_admin_1.auth)().createUser({
            uid: mykey,
            email: response.data.MyProfile.email,
            // phoneNumber: response.data.MyProfile.phoneNumber,
            password: password,
            displayName: response.data.MyProfile.firstname +
                " " +
                response.data.MyProfile.lastname,
            photoURL: response.data.MyProfile.photoURL,
            disabled: false,
        });
        yield firestore
            .collection("profile")
            .doc(mykey)
            .set(Object.assign(Object.assign({}, response.data.MyProfile), { password }));
        return response.data;
    }
    catch (error) {
        throw error;
    }
});
exports.initializeprofile = initializeprofile;
