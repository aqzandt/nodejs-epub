import express from "express";
import path from "path";

import { routeHandler } from "./routes/routeHandler.ts";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/", express.static(path.join(__dirname, "../public")));

routeHandler(app);

app.listen(3000);
console.log("Express started on port 3000");
