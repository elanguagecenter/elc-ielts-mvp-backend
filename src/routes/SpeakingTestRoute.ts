import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import {
  createNewSpeakingStage,
  createNewSpeakingTest,
  getExistingSpeakingStages,
  getSpecificExistingSpeakingStage,
  getSpecificSpeakingTestQuestion,
  updateSpeakingTestQuestion,
} from "../controllers/SpeakingTestController";

const speakingTestRoute = express.Router();

// routes begining /ielts/test/:testId/speaking
speakingTestRoute.post("/", CognitoAuthMiddleware, createNewSpeakingTest);
speakingTestRoute.get("/stages", CognitoAuthMiddleware, getExistingSpeakingStages);
speakingTestRoute.post("/stages/:stgNumber", CognitoAuthMiddleware, createNewSpeakingStage);
speakingTestRoute.get("/stages/:stgNumber", CognitoAuthMiddleware, getSpecificExistingSpeakingStage);
speakingTestRoute.get("/stages/:stgNumber/question/:qid", CognitoAuthMiddleware, getSpecificSpeakingTestQuestion);
speakingTestRoute.put("/stages/:stgNumber/question/:qid", CognitoAuthMiddleware, updateSpeakingTestQuestion);

export default speakingTestRoute;
