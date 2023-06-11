import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 8081;

app.use(bodyParser.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server started: http://localhost:${port}`);
});
