import { Router } from "express";
import { z } from "zod";
import { login, profile, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/register",
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8)
      }),
      query: z.any(),
      params: z.any()
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
      }),
      query: z.any(),
      params: z.any()
    })
  ),
  login
);

router.get("/me", requireAuth, profile);

export default router;

