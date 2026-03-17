import { Request, Response } from "express";
import { AppContainer } from "../application/container";

export function createCartController(container: AppContainer) {
  const { cartService } = container.services;

  return {
    getCart: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const cart = await cartService.getCart(req.user!.id);
      return res.json(cart);
    },

    addCartItem: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const cart = await cartService.addItem(req.user!.id, req.body.productId, req.body.quantity);
      return res.status(201).json(cart);
    },

    updateCartItem: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
      const cart = await cartService.updateItem(req.user!.id, itemId, req.body.quantity);
      return res.json(cart);
    },

    removeCartItem: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
      const cart = await cartService.removeItem(req.user!.id, itemId);
      return res.json(cart);
    },

    clearCart: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const cart = await cartService.clearCart(req.user!.id);
      return res.json(cart);
    }
  };
}
