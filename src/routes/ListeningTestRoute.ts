import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import ListeningTestController from "../controllers/ListeningTestController";
import EndPointAccessVerifyMiddleware from "../middlewares/EndPointAccessVerifyMiddleware";

const listeningTestRoute = express.Router({ mergeParams: true });
const listeningTestController: ListeningTestController = new ListeningTestController();

// routes begining /ielts/test/:testId/listening
listeningTestRoute.post("/", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.StudentAccess, listeningTestController.createTest.bind(listeningTestController));
listeningTestRoute.get(
  "/",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  listeningTestController.getAllListeningTestsByTestIdOrUserId.bind(listeningTestController)
);
listeningTestRoute.post(
  "/:listeningTestId/stages",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  listeningTestController.createTestStage.bind(listeningTestController)
);
listeningTestRoute.get(
  "/:listeningTestId/stages",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  listeningTestController.getListeningTestStageByStageNum.bind(listeningTestController)
);
listeningTestRoute.get(
  "/:listeningTestId/stages/:stageId",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  listeningTestController.getTestStageByStageId.bind(listeningTestController)
);
listeningTestRoute.put(
  "/:listeningTestId/stages/:stageId",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  listeningTestController.updateTestStage.bind(listeningTestController)
);
listeningTestRoute.get(
  "/:listeningTestId/stages/:stageId/questions",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  listeningTestController.getQuestionsForListeningTestStage.bind(listeningTestController)
);

export default listeningTestRoute;
