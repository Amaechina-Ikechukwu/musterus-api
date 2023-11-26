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
exports.CreateUser = void 0;
const firebase_admin_1 = require("firebase-admin");
const addusertodatabase_1 = __importDefault(require("./addusertodatabase"));
function CreateUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userRecord = yield (0, firebase_admin_1.auth)().createUser({
                email: user.email,
                // phoneNumber: user.phoneNumber,
                password: user.password,
                displayName: user.firstname + " " + user.lastname,
                photoURL: user.photoURL,
                disabled: false,
            });
            yield (0, addusertodatabase_1.default)(userRecord.uid, user)
                .then(() => { })
                .catch((error) => {
                throw new Error(error.message);
            });
            return userRecord.uid;
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.CreateUser = CreateUser;
