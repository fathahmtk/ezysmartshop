import { Request, Response } from "express";
import { AppContainer } from "../application/container";

export function createOrderController(container: AppContainer) {
  const { orderService, cartService } = container.services;

  return {
    listOrders: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const entries = await orderService.listByUser(req.user!.id);
      return res.json(entries);
    },

    getOrder: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
      const order = await orderService.getById(req.user!.id, orderId);
      return res.json(order);
    },

    getQuote: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const quote = await orderService.quote(req.body.items, req.body.couponCode);
      return res.json(quote);
    },

    createOrder: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const order = await orderService.create({
        userId: req.user!.id,
        shippingAddress: req.body.shippingAddress,
        items: req.body.items,
        paymentMethod: req.body.paymentMethod,
        couponCode: req.body.couponCode
      });
      await cartService.clearCart(req.user!.id);

      return res.status(201).json(order);
    },

    cancelOrder: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
      const order = await orderService.cancel(req.user!.id, orderId);
      return res.json(order);
    }
  };
}
