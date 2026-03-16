import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { sessionCookieOptions } from "../utils/cookies";

const authService = new AuthService();

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const result = await authService.register(name, email, password);
  res.cookie("token", result.token, sessionCookieOptions());
  return res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  if (!result) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.cookie("token", result.token, sessionCookieOptions());

  return res.json(result);
}

export async function profile(req: Request, res: Response) {
  return res.json({ user: req.user, csrfToken: req.csrfToken });
}
