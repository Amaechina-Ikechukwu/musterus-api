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
function InitializeStudent(uid, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, firestore_1.getFirestore)();
        try {
            const schoolId = user.school;
            const facultyId = user.faculty;
            const departmentId = user.department;
            const levelId = user.level;
            // Create a reference to the 'groups' collection
            const groupsRef = firestore.collection("groups");
            // Add user to school group
            yield groupsRef
                .doc("schoolGroups")
                .collection(schoolId)
                .doc("groupMembers")
                .set({ [uid]: true }, { merge: true });
            // Add user to faculty group
            yield groupsRef
                .doc("schoolGroups")
                .collection(schoolId)
                .doc("facultyGroups")
                .collection(facultyId)
                .doc("groupMembers")
                .set({ [uid]: true }, { merge: true });
            // Add user to department group
            yield groupsRef
                .doc("schoolGroups")
                .collection(schoolId)
                .doc("departmentGroups")
                .collection(departmentId)
                .doc("groupMembers")
                .set({ [uid]: true }, { merge: true });
            // Add user to level group
            yield groupsRef
                .doc("schoolGroups")
                .collection(schoolId)
                .doc("facultyGroups")
                .collection(facultyId)
                .doc("departmentGroups")
                .collection(departmentId)
                .doc("levelGroups")
                .collection(levelId)
                .doc("groupMembers")
                .set({ [uid]: true }, { merge: true });
            // Add user to level group no matter the department or faculty
            yield groupsRef
                .doc("schoolGroups")
                .collection(schoolId)
                .doc("SpeciallevelGroups")
                .collection(levelId)
                .doc("groupMembers")
                .set({ [uid]: true }, { merge: true });
            return "done";
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error && "code" in error) {
                const firebaseError = error;
                throw new Error(firebaseError.message || "Firebase error occurred");
            }
            else {
                throw new Error("Error adding user to database" + error);
            }
        }
    });
}
exports.default = InitializeStudent;
