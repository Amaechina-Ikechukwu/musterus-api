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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index")); // Check the path to your app file
let authToken = ""; // Store the token globally
describe("Authentication API Tests", () => {
    it("should respond with status 200 for /auth/signup and get token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/signup").send({
            username: "testuser",
            password: "password123",
            fullName: "jfjfj fjfj",
            email: "kfkffff@gmail.com",
        });
        expect(response.status).toBe(200);
        // Extract token from the signup response
        authToken = response.body.userToken; // Adjust the token extraction based on your response structure
        console.log("Use this token before for other test, || example set TOKEN=your_token_here && npm test profileroute.test.ts ||");
        console.log(authToken);
    }), 20000);
    it("should respond with status 200 for /auth/deleteuser using the token", () => __awaiter(void 0, void 0, void 0, function* () {
        // Check if a token exists from the signup test
        if (!authToken) {
            throw new Error("Token not available. Run the signup test first.");
        }
        const response = yield (0, supertest_1.default)(index_1.default)
            .delete("/auth/deleteuser")
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        // Add more assertions based on your expected response
    }), 10000);
    // Add more test cases for other routes if needed
});
