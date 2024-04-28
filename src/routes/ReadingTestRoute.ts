import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import ReadingTestController from "../controllers/ReadingTestController";
import EndPointAccessVerifyMiddleware from "../middlewares/EndPointAccessVerifyMiddleware";

const readingTestRoute = express.Router({ mergeParams: true });
const readingTestController: ReadingTestController = new ReadingTestController();

// routes begining /ielts/test/:testId/reading
readingTestRoute.post("/", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.StudentAccess, readingTestController.createReadingTest.bind(readingTestController));
readingTestRoute.get(
  "/",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  readingTestController.getAllReadingTestsByTestIdOrUserId.bind(readingTestController)
);
readingTestRoute.post(
  "/:readingTestId/stages",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  readingTestController.createReadingTestStage.bind(readingTestController)
);
readingTestRoute.get(
  "/:readingTestId/stages",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  readingTestController.getReadingTestStageByStageNum.bind(readingTestController)
);
readingTestRoute.get(
  "/:readingTestId/stages/:stageId",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  readingTestController.getTestStageByStageId.bind(readingTestController)
);
readingTestRoute.put(
  "/:readingTestId/stages/:stageId",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  readingTestController.updateTestStage.bind(readingTestController)
);
readingTestRoute.get(
  "/:readingTestId/stages/:stageId/questions",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  readingTestController.getQuestionsForReadingTestStage.bind(readingTestController)
);

export default readingTestRoute;
