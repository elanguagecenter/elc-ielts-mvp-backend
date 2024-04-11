import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import ReadingTestController from "../controllers/ReadingTestController";

const readingTestRoute = express.Router({ mergeParams: true });
const readingTestController: ReadingTestController = new ReadingTestController();

// routes begining /ielts/test/:testId/reading
readingTestRoute.post("/", CognitoAuthMiddleware, readingTestController.createReadingTest.bind(readingTestController));
readingTestRoute.get("/", CognitoAuthMiddleware, readingTestController.getAllReadingTestsByTestIdOrUserId.bind(readingTestController));
readingTestRoute.post("/:readingTestId/stages", CognitoAuthMiddleware, readingTestController.createReadingTestStage.bind(readingTestController));
readingTestRoute.get("/:readingTestId/stages", CognitoAuthMiddleware, readingTestController.getReadingTestStageByStageNum.bind(readingTestController));
readingTestRoute.get("/:readingTestId/stages/:stageId", CognitoAuthMiddleware, readingTestController.getTestStageByStageId.bind(readingTestController));
readingTestRoute.put("/:readingTestId/stages/:stageId", CognitoAuthMiddleware, readingTestController.updateTestStage.bind(readingTestController));
readingTestRoute.get("/:readingTestId/stages/:stageId/questions", CognitoAuthMiddleware, readingTestController.getQuestionsForReadingTestStage.bind(readingTestController));

export default readingTestRoute;
