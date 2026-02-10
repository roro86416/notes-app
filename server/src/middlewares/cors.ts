import cors from "cors";
import { env } from "../env.js";

export const corsMiddleware = cors({
  origin: env.WEB_ORIGIN,
  credentials: true,
});
