import { NextFunction, Request, Response } from "express";

export function errorHandler(error: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Unexpected server error"
  });
}
