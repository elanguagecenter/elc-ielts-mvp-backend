import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import { createNewTest, getSpecificTest } from "../controllers/TestController";

const testRoute = express.Router();

// routes begining /ielts/test
testRoute.get("/:testId", CognitoAuthMiddleware, getSpecificTest);
testRoute.post("/", CognitoAuthMiddleware, createNewTest);

export default testRoute;
