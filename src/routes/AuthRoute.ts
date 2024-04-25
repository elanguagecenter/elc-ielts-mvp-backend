import express from "express";
import AuthController from "../controllers/AuthController";

const authoute = express.Router({ mergeParams: true });
const authController: AuthController = new AuthController();

// routes begining /ielts/auth
authoute.post("/students", authController.signInStudent.bind(authController));
authoute.post("/students/cognitoChallange", authController.completeCognitoChallange.bind(authController));

export default authoute;
