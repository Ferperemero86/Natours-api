import express from "express";
import morgan from "morgan";
import path from "path";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";

import router from "./routes/index.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Morgan logiing setup
const accessLogStream = createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());

app.use("/api/v1", router);

export default app;
