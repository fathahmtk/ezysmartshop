import { Router } from "express";
import { z } from "zod";
import { createPaymentIntent } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/payments/intent",
  requireAuth,
  validate(
    z.object({
      body: z.object({
        method: z.enum(["razorpay", "stripe", "cod"]),
        couponCode: z.string().trim().optional(),
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().int().positive()
          })
        ).min(1)
      }),
      query: z.any(),
      params: z.any()
    })
  ),
  createPaymentIntent
);

export default router;
