import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import WritingTestController from "../controllers/WritingTestController";

const writingTestRoute = express.Router({ mergeParams: true });
const writingTestController = new WritingTestController();
// routes begining /ielts/test/:testId/writing
writingTestRoute.get("/", CognitoAuthMiddleware, writingTestController.getAllWritingTestsByTestIdOrUserId.bind(writingTestController));
writingTestRoute.post("/", CognitoAuthMiddleware, writingTestController.createWritingTest.bind(writingTestController));
// writingTestRoute.put("/:writingTestId", CognitoAuthMiddleware, writingTestController.updateWritingTest.bind(writingTestController));
writingTestRoute.get("/:writingTestId/stages", CognitoAuthMiddleware, writingTestController.getNextAvailableWritingTestStages.bind(writingTestController));
writingTestRoute.put("/:writingTestId/stages/:writingTestStageId", CognitoAuthMiddleware, writingTestController.updateWritingTestStage.bind(writingTestController));

export default writingTestRoute;
