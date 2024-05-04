import express from "express";
import UserController from "../controllers/UserController";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import EndPointAccessVerifyMiddleware from "../middlewares/EndPointAccessVerifyMiddleware";

const userRoute = express.Router({ mergeParams: true });
const userController: UserController = new UserController();

// routes begining /ielts/users
userRoute.get("/", CognitoAuthMiddleware, userController.getUser.bind(userController));
userRoute.post("/", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.createUser.bind(userController));
userRoute.get("/students", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.getStudents.bind(userController));
userRoute.get("/teachers", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.allAdminAccess, userController.getTeachers.bind(userController));

export default userRoute;
