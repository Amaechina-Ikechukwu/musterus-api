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
exports.LoginUser = void 0;
const firestore_1 = require("firebase-admin/firestore");
const muateruslogin_1 = require("./muateruslogin");
const initializprofile_1 = require("./initializprofile");
function LoginUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firestore = (0, firestore_1.getFirestore)();
            const snapshot = yield firestore
                .collection("profile")
                .where(firestore_1.Filter.or(firestore_1.Filter.where("email", "==", user.email), firestore_1.Filter.where("registeremail", "==", user.email), firestore_1.Filter.where("username", "==", user.email)))
                .where("password", "==", user.password)
                .get();
            if (snapshot.empty) {
                try {
                    const result = yield (0, muateruslogin_1.musteruslogin)(user.email, user.password);
                    yield (0, initializprofile_1.initializeprofile)(result.mykey, result.mskl, user.password);
                    return result.mykey;
                }
                catch (err) {
                    throw new Error("No user found");
                }
            }
            const profile = [];
            snapshot.forEach((doc) => {
                profile.push(doc.id);
            });
            return profile[0];
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.LoginUser = LoginUser;
