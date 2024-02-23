import express, { Express } from "express";
import cors from "cors";
import configs from "./config/configs";
import healthCheckRouter from "./routes/HealthCheckRoute";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/healthcheck", healthCheckRouter);

app.listen(process.env.PORT, () => {
  console.log("Server Listening on PORT:", configs.port);
});
