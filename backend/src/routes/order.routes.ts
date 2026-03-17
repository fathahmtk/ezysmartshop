import { Router } from "express";
import { z } from "zod";
import { AppContainer } from "../application/container";
import { createOrderController } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const emptyObject = z.object({}).strict();

export default function createOrderRoutes(container: AppContainer) {
  const router = Router();
  const { cancelOrder, createOrder, getOrder, getQuote, listOrders } = createOrderController(container);

  router.use(requireAuth);

  router.get("/orders", listOrders);
  router.get("/orders/:orderId", getOrder);
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
            }).strict()
          ).min(1)
        }).strict(),
        query: emptyObject,
        params: emptyObject
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
            }).strict()
          ).min(1)
        }).strict(),
        query: emptyObject,
        params: emptyObject
      })
    ),
    createOrder
  );
  router.patch(
    "/orders/:orderId/cancel",
    validate(
      z.object({
        body: emptyObject,
        query: emptyObject,
        params: z.object({
          orderId: z.string().min(1)
        }).strict()
      })
    ),
    cancelOrder
  );

  return router;
}
