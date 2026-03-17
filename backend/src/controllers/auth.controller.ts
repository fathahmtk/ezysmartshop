import { Request, Response } from "express";
import { AppContainer } from "../application/container";
import { sessionCookieOptions } from "../utils/cookies";

export function createAuthController(container: AppContainer) {
  const { authService } = container.services;

  return {
    register: async (req: Request, res: Response) => {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      res.set("Cache-Control", "no-store");
      res.cookie("token", result.token, sessionCookieOptions());
      return res.status(201).json(result);
    },

    login: async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      if (!result) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.set("Cache-Control", "no-store");
      res.cookie("token", result.token, sessionCookieOptions());

      return res.json(result);
    },

    profile: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      return res.json({ user: req.user, csrfToken: req.csrfToken });
    }
  };
}
