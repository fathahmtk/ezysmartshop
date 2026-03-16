import { Router } from "express";
import { z } from "zod";
import { createOrder, getQuote, listOrders } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.use(requireAuth);

router.get("/orders", listOrders);
router.post(
  "/orders/quote",
  validate(
    z.object({
      body: z.object({
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
  getQuote
);
router.post(
  "/orders",
  validate(
    z.object({
      body: z.object({
        shippingAddress: z.string().min(10),
        paymentMethod: z.enum(["razorpay", "stripe", "cod"]),
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
  createOrder
);

export default router;
