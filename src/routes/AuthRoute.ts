import express from "express";
import AuthController from "../controllers/AuthController";

const authoute = express.Router({ mergeParams: true });
const authController: AuthController = new AuthController();

// routes begining /ielts/auth
authoute.post("/users", authController.signInUser.bind(authController));
authoute.post("/users/cognitoChallange", authController.completeCognitoChallange.bind(authController));
authoute.delete("/users", authController.userSignout.bind(authController));

export default authoute;
