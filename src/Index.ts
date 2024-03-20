import express, { Express } from "express";
import cors from "cors";
import configs from "./config/configs";
import healthCheckRouter from "./routes/HealthCheckRoute";
import { SimpleErrorHandler } from "./middlewares/GlobalErrorHandlingMiddleware";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import testRoute from "./routes/TestRoute";
import speakingTestRoute from "./routes/SpeakingTestRoute";
import MediaSockServer from "./MediaSockServer";
import writingTestRoute from "./routes/WritingTestRoute";

const app: Express = express();
const mediaSockServer: MediaSockServer = MediaSockServer.getInstance();

// cors and json middlewares
app.use(cors());
app.use(express.json());

// swagger openapi doc route
const swaggerDocument = YAML.load("./src/apiDocs/openapi.yaml");
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Buisness logic routes
app.use("/healthcheck", healthCheckRouter);
app.use("/ielts/test/:testId/speaking", speakingTestRoute);
app.use("/ielts/test/:testId/writing", writingTestRoute);
app.use("/ielts/test", testRoute);

/* Global middlewares
 * 1- Error handling middleware
 */
app.use(SimpleErrorHandler);

mediaSockServer.start();
app.listen(process.env.PORT, () => {
  console.log("Server Listening on PORT:", configs.port);
  console.log("API Doc URL:", `${configs.serverUrl}/api`);
});
