import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError)
    return res
      .status(400)
      .json({ error: "VALIDATION_ERROR", issues: err.issues });
  console.error(err);
  return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
}
