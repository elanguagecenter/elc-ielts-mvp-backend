import express, { Express } from "express";
import cors from "cors";
import configs from "./config/configs";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Server Listening on PORT:", configs.port);
});
