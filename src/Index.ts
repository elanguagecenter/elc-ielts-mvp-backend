import express, { Express } from "express";
import http from "http";
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
import readingTestRoute from "./routes/ReadingTestRoute";
import listeningTestRoute from "./routes/ListeningTestRoute";
import resourceRoute from "./routes/ResourceRoute";
import authoute from "./routes/AuthRoute";
import userRoute from "./routes/UserRoute";
import organizationRoute from "./routes/OrganizationRoute";

const app: Express = express();
const server: http.Server = http.createServer(app);
const mediaSockServer: MediaSockServer = new MediaSockServer(server);

// cors and json middlewares
app.use(cors());
app.use(express.json());

// swagger openapi doc route
const swaggerDocument = YAML.load("src/apiDocs/openapi.yaml");
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Buisness logic routes
app.use("/healthcheck", healthCheckRouter);
app.use("/ielts/auth", authoute);
app.use("/ielts/users", userRoute);
app.use("/ielts/test/:testId/speaking", speakingTestRoute);
app.use("/ielts/test/:testId/writing", writingTestRoute);
app.use("/ielts/test/:testId/reading", readingTestRoute);
app.use("/ielts/test/:testId/listening", listeningTestRoute);
app.use("/ielts/test", testRoute);
app.use("/ielts/resources", resourceRoute);
app.use("/ielts/organization", organizationRoute);
/* Global middlewares
 * 1- Error handling middleware
 */
app.use(SimpleErrorHandler);

server.listen(configs.port, () => {
  console.log("Server Listening on PORT:", configs.port);
  console.log("API Doc URL:", `${configs.serverUrl}/api`);
});

server.on("close", () => {
  console.log("Closing the websocket server");
  mediaSockServer.close();
});
