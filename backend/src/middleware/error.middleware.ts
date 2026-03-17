import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export function errorHandler(error: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = error.statusCode || 500;
  const requestId = _req.requestId;

  if (statusCode >= 500) {
    logger.error({
      event: "request_failed",
      requestId,
      message: error.message,
      stack: error.stack
    });
  }

  return res.status(statusCode).json({
    message: statusCode >= 500 && env.nodeEnv === "production" ? "Unexpected server error" : error.message || "Unexpected server error",
    requestId
  });
}
