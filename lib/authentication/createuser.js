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
exports.CreateUser = void 0;
const firebase_admin_1 = require("firebase-admin");
function CreateUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, firebase_admin_1.auth)()
                .createUser({
                email: user.email,
                phoneNumber: user.phoneNumber,
                password: user.password,
                displayName: user.fullName,
                photoURL: user.photoURL,
                disabled: false,
            })
                .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log("Successfully created new user:", userRecord);
            })
                .catch((error) => {
                console.log("Error creating new user:", error);
            });
        }
        catch (err) {
            throw new Error("Error creating new user");
        }
    });
}
exports.CreateUser = CreateUser;
