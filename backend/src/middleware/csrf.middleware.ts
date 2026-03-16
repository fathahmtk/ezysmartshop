import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { csrfCookieOptions } from "../utils/cookies";

const CSRF_COOKIE = "csrf_token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function createCsrfToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function issueCsrfToken(req: Request, res: Response, next: NextFunction) {
  const existing = req.cookies?.[CSRF_COOKIE];
  const token = existing || createCsrfToken();

  req.csrfToken = token;

  if (!existing) {
    res.cookie(CSRF_COOKIE, token, csrfCookieOptions());
  }

  return next();
}

export function verifyCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  if (req.path === "/api/login" || req.path === "/api/register") {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const requestToken = req.headers["x-csrf-token"] || req.body?._csrf;

  if (!cookieToken || !requestToken || cookieToken !== requestToken) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  return next();
}
