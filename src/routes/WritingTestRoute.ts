import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import WritingTestController from "../controllers/WritingTestController";
import EndPointAccessVerifyMiddleware from "../middlewares/EndPointAccessVerifyMiddleware";

const writingTestRoute = express.Router({ mergeParams: true });
const writingTestController = new WritingTestController();
// routes begining /ielts/test/:testId/writing
writingTestRoute.get(
  "/",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  writingTestController.getAllWritingTestsByTestIdOrUserId.bind(writingTestController)
);
writingTestRoute.post("/", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.StudentAccess, writingTestController.createWritingTest.bind(writingTestController));
// writingTestRoute.put("/:writingTestId", CognitoAuthMiddleware, writingTestController.updateWritingTest.bind(writingTestController));
writingTestRoute.get(
  "/:writingTestId/stages",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  writingTestController.getNextAvailableWritingTestStages.bind(writingTestController)
);
writingTestRoute.put(
  "/:writingTestId/stages/:writingTestStageId",
  CognitoAuthMiddleware,
  EndPointAccessVerifyMiddleware.StudentAccess,
  writingTestController.updateWritingTestStage.bind(writingTestController)
);

export default writingTestRoute;
