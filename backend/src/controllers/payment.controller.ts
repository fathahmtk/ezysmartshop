import { Request, Response } from "express";
import { AppContainer } from "../application/container";

export function createPaymentController(container: AppContainer) {
  const { orderService, paymentService } = container.services;

  return {
    createPaymentIntent: async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      const quote = await orderService.quote(req.body.items, req.body.couponCode);
      const data = await paymentService.createIntent(req.body.method, quote.total);
      return res.status(201).json(data);
    }
  };
}
