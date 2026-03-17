import { CookieOptions } from "express";
import { env } from "../config/env";

export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.secureCookies,
    domain: env.cookieDomain,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7
  };
}

export function csrfCookieOptions(): CookieOptions {
  return {
    httpOnly: false,
    sameSite: "lax",
    secure: env.secureCookies,
    domain: env.cookieDomain,
    path: "/"
  };
}
