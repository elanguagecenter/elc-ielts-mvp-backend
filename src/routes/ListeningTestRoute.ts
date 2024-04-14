import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import ListeningTestController from "../controllers/ListeningTestController";

const listeningTestRoute = express.Router({ mergeParams: true });
const listeningTestController: ListeningTestController = new ListeningTestController();

// routes begining /ielts/test/:testId/reading
listeningTestRoute.post("/", CognitoAuthMiddleware, listeningTestController.createTest.bind(listeningTestController));
// listeningTestRoute.get("/", CognitoAuthMiddleware, listeningTestController.getAllReadingTestsByTestIdOrUserId.bind(listeningTestController));
listeningTestRoute.post("/:listeningTestId/stages", CognitoAuthMiddleware, listeningTestController.createTestStage.bind(listeningTestController));
// listeningTestRoute.get("/:readingTestId/stages", CognitoAuthMiddleware, listeningTestController.getReadingTestStageByStageNum.bind(readingTestController));
// listeningTestRoute.get("/:readingTestId/stages/:stageId", CognitoAuthMiddleware, listeningTestController.getTestStageByStageId.bind(readingTestController));
// listeningTestRoute.put("/:readingTestId/stages/:stageId", CognitoAuthMiddleware, listeningTestController.updateTestStage.bind(readingTestController));
// listeningTestRoute.get("/:readingTestId/stages/:stageId/questions", CognitoAuthMiddleware, listeningTestController.getQuestionsForReadingTestStage.bind(listeningTestController));

export default listeningTestRoute;
