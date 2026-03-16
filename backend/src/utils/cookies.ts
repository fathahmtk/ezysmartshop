import { CookieOptions } from "express";
import { env } from "../config/env";

export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.secureCookies,
    domain: env.cookieDomain,
    path: "/"
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
