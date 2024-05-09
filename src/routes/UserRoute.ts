import express from "express";
import UserController from "../controllers/UserController";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import EndPointAccessVerifyMiddleware from "../middlewares/EndPointAccessVerifyMiddleware";

const userRoute = express.Router({ mergeParams: true });
const userController: UserController = new UserController();

// routes begining /ielts/users
userRoute.get("/", CognitoAuthMiddleware, userController.getUser.bind(userController));
userRoute.post("/", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.createUser.bind(userController));
userRoute.get("/admins/all", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.SuperAdminAccess, userController.getAllAdmins.bind(userController));
userRoute.get("/admins/fresh", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.SuperAdminAccess, userController.getFreshAdmins.bind(userController));
userRoute.get("/students", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.getStudents.bind(userController));
userRoute.get("/teachers", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.getTeachers.bind(userController));

userRoute.delete("/admins/:adminId", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.deleteOrgAdmin.bind(userController));
userRoute.delete("/teachers/:teacherId", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.deleteTeacher.bind(userController));
userRoute.delete("/students/:studentId", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.deleteStudent.bind(userController));

export default userRoute;
