import { Router } from "express";
import { z } from "zod";
import { AppContainer } from "../application/container";
import { createAuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const emptyObject = z.object({}).strict();

export default function createAuthRoutes(container: AppContainer) {
  const router = Router();
  const { login, profile, register } = createAuthController(container);

  router.post(
    "/register",
    validate(
      z.object({
        body: z.object({
          name: z.string().min(2),
          email: z.string().email(),
          password: z.string().min(8)
        }).strict(),
        query: emptyObject,
        params: emptyObject
      })
    ),
    register
  );

  router.post(
    "/login",
    validate(
      z.object({
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8)
        }).strict(),
        query: emptyObject,
        params: emptyObject
      })
    ),
    login
  );

  router.get("/me", requireAuth, profile);

  return router;
}

