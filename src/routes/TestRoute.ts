import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import TestController from "../controllers/TestController";

const testRoute = express.Router();
const testController = new TestController();

// routes begining /ielts/test
testRoute.get("/:testId", CognitoAuthMiddleware, testController.getSpecificTest);
testRoute.post("/", CognitoAuthMiddleware, testController.createNewTest);

export default testRoute;
