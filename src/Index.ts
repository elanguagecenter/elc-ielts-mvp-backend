import express, { Express } from "express";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Server Listening on PORT:", process.env.PORT);
});
