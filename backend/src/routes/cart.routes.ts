import { Router } from "express";
import { z } from "zod";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.use(requireAuth);

router.get("/cart", getCart);
router.post(
  "/cart/items",
  validate(
    z.object({
      body: z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive()
      }),
      query: z.any(),
      params: z.any()
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
      }),
      query: z.any(),
      params: z.object({
        itemId: z.string().min(1)
      })
    })
  ),
  updateCartItem
);
router.delete(
  "/cart/items/:itemId",
  validate(
    z.object({
      body: z.any(),
      query: z.any(),
      params: z.object({
        itemId: z.string().min(1)
      })
    })
  ),
  removeCartItem
);

export default router;
