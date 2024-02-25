import express from "express";
import { getHealth } from "../controllers/HealthCheckController";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";

const healthCheckRouter = express.Router();

healthCheckRouter.get("/", CognitoAuthMiddleware, getHealth);

export default healthCheckRouter;
