import { Router } from "express";
import { z } from "zod";
import { AppContainer } from "../application/container";
import { createPaymentController } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const emptyObject = z.object({}).strict();

export default function createPaymentRoutes(container: AppContainer) {
  const router = Router();
  const { createPaymentIntent } = createPaymentController(container);

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
            }).strict()
          ).min(1)
        }).strict(),
        query: emptyObject,
        params: emptyObject
      })
    ),
    createPaymentIntent
  );

  return router;
}
