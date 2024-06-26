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
exports.musteruslogin = void 0;
const axios_1 = __importDefault(require("axios"));
const firestore_1 = require("firebase-admin/firestore");
const api = axios_1.default.create({
    baseURL: "https://www.musterus.com", // Replace with your API base URL
});
const musteruslogin = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.post(`/ws/authenticate?username=${username}&password=${password}`);
        const dataresponse = yield api.post(`/ws/home?mykey=${response.data.mykey}&mskl=${response.data.mskl}`);
        const firestore = (0, firestore_1.getFirestore)();
        yield firestore
            .collection("profile")
            .doc(response.data.mykey)
            .set(Object.assign({ username,
            password }, response.data));
        return response.data;
    }
    catch (error) {
        throw error;
    }
});
exports.musteruslogin = musteruslogin;
