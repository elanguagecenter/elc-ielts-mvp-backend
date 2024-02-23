import express, { Express } from "express";
import cors from "cors";
import configs from "./config/configs";
import healthCheckRouter from "./routes/HealthCheckRoute";
import { SimpleErrorHandler } from "./middlewares/GlobalErrorHandlingMiddleware";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app: Express = express();

// cors and json middlewares
app.use(cors());
app.use(express.json());

// swagger openapi doc route
const swaggerDocument = YAML.load("./src/apiDocs/openapi.yaml");
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Buisness logic routes
app.use("/healthcheck", healthCheckRouter);

/* Global middlewares
 * 1- Error handling middleware
 */
app.use(SimpleErrorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server Listening on PORT:", configs.port);
});
