import express from "express";
import morgan from "morgan";
import { env } from "./env.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { parseJwt } from "./middlewares/jwt.js";
import { errorHandler } from "./middlewares/error.js";
import { apiAuth } from "./routes/api.auth.js";
import { apiNotes } from "./routes/api.notes.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(corsMiddleware);
app.use(parseJwt);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", apiAuth);
app.use("/api/notes", apiNotes);
app.use(errorHandler);

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`API on http://localhost:${env.PORT}`);
});
