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
const firestore_1 = require("firebase-admin/firestore");
function AddUserToDatabase(uid, data) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = {
                uid: data === null || data === void 0 ? void 0 : data.uid,
                email: data === null || data === void 0 ? void 0 : data.email,
                emailVerified: data === null || data === void 0 ? void 0 : data.emailVerified,
                displayName: data === null || data === void 0 ? void 0 : data.displayName,
                disabled: data === null || data === void 0 ? void 0 : data.disabled,
                tokensValidAfterTime: data === null || data === void 0 ? void 0 : data.tokensValidAfterTime,
                providerData: (_a = data === null || data === void 0 ? void 0 : data.providerData) === null || _a === void 0 ? void 0 : _a.map((provider) => ({
                    uid: provider.uid,
                    displayName: provider.displayName,
                    email: provider.email,
                    providerId: provider.providerId,
                })),
                // Additional fields
                phoneNumber: data === null || data === void 0 ? void 0 : data.phoneNumber,
                photoURL: data === null || data === void 0 ? void 0 : data.photoURL,
                // Metadata? fields
                metadata: {
                    creationTime: (_b = data === null || data === void 0 ? void 0 : data.metadata) === null || _b === void 0 ? void 0 : _b.creationTime,
                    lastSignInTime: (_c = data === null || data === void 0 ? void 0 : data.metadata) === null || _c === void 0 ? void 0 : _c.lastSignInTime,
                    // Add other relevant metadata? fields
                },
            };
            const res = yield (0, firestore_1.getFirestore)().collection("profile").doc(uid).set(data);
            return res;
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    });
}
exports.default = AddUserToDatabase;
