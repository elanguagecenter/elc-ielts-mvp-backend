import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import SpeakingTestController from "../controllers/SpeakingTestController";

const speakingTestRoute = express.Router({ mergeParams: true });
const speakingTestController: SpeakingTestController = new SpeakingTestController();

// routes begining /ielts/test/:testId/speaking
speakingTestRoute.post("/", CognitoAuthMiddleware, speakingTestController.createNewSpeakingTest.bind(speakingTestController));
speakingTestRoute.get("/", CognitoAuthMiddleware, speakingTestController.getAllSpeakingTestsByTestIdOrUserId.bind(speakingTestController));
speakingTestRoute.get("/:speakingTestId/stages", CognitoAuthMiddleware, speakingTestController.getNextAvailableWritingTestStages.bind(speakingTestController));
speakingTestRoute.get("/:speakingTestId/stages/:stageId", CognitoAuthMiddleware, speakingTestController.getSpecificExistingSpeakingStage.bind(speakingTestController));

speakingTestRoute.put("/:speakingTestId/stages/:stageId", CognitoAuthMiddleware, speakingTestController.updateSpeakingTestStage.bind(speakingTestController));

export default speakingTestRoute;
