import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import SpeakingTestController from "../controllers/SpeakingTestController";

const speakingTestRoute = express.Router();
const speakingTestController: SpeakingTestController = new SpeakingTestController();

// routes begining /ielts/test/:testId/speaking
speakingTestRoute.post("/", CognitoAuthMiddleware, speakingTestController.createNewSpeakingTest);
speakingTestRoute.get("/stages", CognitoAuthMiddleware, speakingTestController.getExistingSpeakingStages);
speakingTestRoute.post("/stages/:stgNumber", CognitoAuthMiddleware, speakingTestController.createNewSpeakingStage);
speakingTestRoute.get("/stages/:stgNumber", CognitoAuthMiddleware, speakingTestController.getSpecificExistingSpeakingStage);
speakingTestRoute.get("/stages/:stgNumber/question/:qid", CognitoAuthMiddleware, speakingTestController.getSpecificSpeakingTestQuestion);
speakingTestRoute.put("/stages/:stgNumber/question/:qid", CognitoAuthMiddleware, speakingTestController.updateSpeakingTestQuestion);

export default speakingTestRoute;
