import express from "express";
import UserController from "../controllers/UserController";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";

const userRoute = express.Router({ mergeParams: true });
const userController: UserController = new UserController();

// routes begining /ielts/users
userRoute.get("/", CognitoAuthMiddleware, userController.getUser.bind(userController));

export default userRoute;
