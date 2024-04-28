import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import SpeakingTestController from "../controllers/SpeakingTestController";
import EndPointAccessVerifyMiddleware from "../middlewares/EndPointAccessVerifyMiddleware";

const speakingTestRoute = express.Router({ mergeParams: true });
const speakingTestController: SpeakingTestController = new SpeakingTestController();

// routes begining /ielts/test/:testId/speaking
speakingTestRoute.post("/", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.StudentAccess, speakingTestController.createNewSpeakingTest.bind(speakingTestController));
speakingTestRoute.get(
  "/",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  speakingTestController.getAllSpeakingTestsByTestIdOrUserId.bind(speakingTestController)
);
speakingTestRoute.get(
  "/:speakingTestId/stages",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  speakingTestController.getNextAvailableWritingTestStages.bind(speakingTestController)
);
speakingTestRoute.get(
  "/:speakingTestId/stages/:stageId",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  speakingTestController.getSpecificExistingSpeakingStage.bind(speakingTestController)
);

speakingTestRoute.put(
  "/:speakingTestId/stages/:stageId",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  speakingTestController.updateSpeakingTestStage.bind(speakingTestController)
);

export default speakingTestRoute;
