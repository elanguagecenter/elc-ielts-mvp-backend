import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import ListeningTestController from "../controllers/ListeningTestController";

const listeningTestRoute = express.Router({ mergeParams: true });
const listeningTestController: ListeningTestController = new ListeningTestController();

// routes begining /ielts/test/:testId/listening
listeningTestRoute.post("/", CognitoAuthMiddleware, listeningTestController.createTest.bind(listeningTestController));
listeningTestRoute.get("/", CognitoAuthMiddleware, listeningTestController.getAllListeningTestsByTestIdOrUserId.bind(listeningTestController));
listeningTestRoute.post("/:listeningTestId/stages", CognitoAuthMiddleware, listeningTestController.createTestStage.bind(listeningTestController));
listeningTestRoute.get("/:listeningTestId/stages", CognitoAuthMiddleware, listeningTestController.getListeningTestStageByStageNum.bind(listeningTestController));
listeningTestRoute.get("/:listeningTestId/stages/:stageId", CognitoAuthMiddleware, listeningTestController.getTestStageByStageId.bind(listeningTestController));
listeningTestRoute.put("/:listeningTestId/stages/:stageId", CognitoAuthMiddleware, listeningTestController.updateTestStage.bind(listeningTestController));
listeningTestRoute.get(
  "/:listeningTestId/stages/:stageId/questions",
  CognitoAuthMiddleware,
  listeningTestController.getQuestionsForListeningTestStage.bind(listeningTestController)
);

export default listeningTestRoute;
