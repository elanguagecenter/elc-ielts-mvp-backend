import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import SpeakingTestController from "../controllers/SpeakingTestController";

const speakingTestRoute = express.Router({ mergeParams: true });
const speakingTestController: SpeakingTestController = new SpeakingTestController();

// routes begining /ielts/test/:testId/speaking
speakingTestRoute.post("/", CognitoAuthMiddleware, speakingTestController.createNewSpeakingTest);
speakingTestRoute.get("/", CognitoAuthMiddleware, speakingTestController.getSpeakingTestByTestId);
speakingTestRoute.get("/stages", CognitoAuthMiddleware, speakingTestController.getExistingSpeakingStages);
speakingTestRoute.get("/stages/:stgNumber", CognitoAuthMiddleware, speakingTestController.getSpecificExistingSpeakingStage);
speakingTestRoute.get("/stages/:stgNumber/question/:qid", CognitoAuthMiddleware, speakingTestController.getSpecificSpeakingTestQuestion);
speakingTestRoute.put("/stages/:stgNumber/question/:qid", CognitoAuthMiddleware, speakingTestController.updateSpeakingTestQuestion);
speakingTestRoute.post("/:speakingTestId/stages/:stageId/start", CognitoAuthMiddleware, speakingTestController.startSpeakingTestStage);
speakingTestRoute.post("/:speakingTestId/stages/:stageId/stop", CognitoAuthMiddleware, speakingTestController.stoptSpeakingTestStage);

export default speakingTestRoute;
