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
exports.ResetPassword = void 0;
const firestore_1 = require("firebase-admin/firestore");
function ResetPassword(uid, oldpassword, newpassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get the Firestore instance
            // Reference to the user's profile document in Firestore
            const userDocRef = (0, firestore_1.getFirestore)().collection("profile").doc(uid); // Assuming the profiles are stored in a "profiles" collection
            if (!(yield userDocRef.get()).exists) {
                return "User profile not found";
            }
            const userData = (yield userDocRef.get()).data();
            // Check if the old password matches the stored password in the user's profile
            if (userData && oldpassword === userData.password) {
                // Update the password in the user's profile document
                yield userDocRef.update({ password: newpassword });
                return "Password updated successfully";
            }
            else {
                return "Authentication error: Old password doesn't match";
            }
        }
        catch (error) {
            console.error("Error updating password:", error);
            return "Error updating password";
        }
    });
}
exports.ResetPassword = ResetPassword;
