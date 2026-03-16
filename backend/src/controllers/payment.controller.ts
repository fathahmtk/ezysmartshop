import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { PaymentService } from "../services/payment.service";

const paymentService = new PaymentService();
const orderService = new OrderService();

export async function createPaymentIntent(req: Request, res: Response) {
  const quote = await orderService.quote(req.body.items, req.body.couponCode);
  const data = await paymentService.createIntent(req.body.method, quote.total);
  return res.status(201).json(data);
}
