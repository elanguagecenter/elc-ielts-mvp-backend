import express from "express";
import { getHealth } from "../controllers/HealthCheckController";

const healthCheckRouter = express.Router();

healthCheckRouter.get("/", getHealth);

export default healthCheckRouter;
