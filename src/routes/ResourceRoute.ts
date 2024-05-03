import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import ResourceController from "../controllers/ResourceController";
import EndPointAccessVerifyMiddleware from "../middlewares/EndPointAccessVerifyMiddleware";

const resourceRoute = express.Router({ mergeParams: true });
const resourceController: ResourceController = new ResourceController();

// routes begining /ielts/resources
resourceRoute.get("/s3/signed-url", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.StudentAccess, resourceController.getS3SignedUrl.bind(resourceController));

export default resourceRoute;
