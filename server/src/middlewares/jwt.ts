import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env.js";
import type { JwtUser } from "../interfaces/auth.js";

export interface AuthedRequest extends Request {
  user?: JwtUser;
}

export function parseJwt(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
) {
  const auth = req.header("authorization");
  if (auth?.startsWith("Bearer ")) {
    try {
      const token = auth.slice(7);
      req.user = jwt.verify(token, env.JWT_SECRET) as JwtUser;
    } catch {}
  }
  next();
}

export function requireJwt(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });
  next();
}
