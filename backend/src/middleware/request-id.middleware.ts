import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

export function attachRequestId(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers["x-request-id"];
  req.requestId = typeof requestId === "string" && requestId.trim() ? requestId.trim() : crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
}
