import { Router } from "express";
import { z } from "zod";
import { AppContainer } from "../application/container";
import { createCartController } from "../controllers/cart.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const emptyObject = z.object({}).strict();

export default function createCartRoutes(container: AppContainer) {
  const router = Router();
  const { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } = createCartController(container);

  router.use(requireAuth);

  router.get("/cart", getCart);
  router.delete("/cart", clearCart);
  router.post(
    "/cart/items",
    validate(
      z.object({
        body: z.object({
          productId: z.string().min(1),
          quantity: z.number().int().positive()
        }).strict(),
        query: emptyObject,
        params: emptyObject
      })
    ),
    addCartItem
  );
  router.patch(
    "/cart/items/:itemId",
    validate(
      z.object({
        body: z.object({
          quantity: z.number().int().nonnegative()
        }).strict(),
        query: emptyObject,
        params: z.object({
          itemId: z.string().min(1)
        }).strict()
      })
    ),
    updateCartItem
  );
  router.delete(
    "/cart/items/:itemId",
    validate(
      z.object({
        body: emptyObject,
        query: emptyObject,
        params: z.object({
          itemId: z.string().min(1)
        }).strict()
      })
    ),
    removeCartItem
  );

  return router;
}
