import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();
const cartService = new CartService();

export async function listOrders(req: Request, res: Response) {
  const entries = await orderService.listByUser(req.user!.id);
  return res.json(entries);
}

export async function getQuote(req: Request, res: Response) {
  const quote = await orderService.quote(req.body.items, req.body.couponCode);
  return res.json(quote);
}

export async function createOrder(req: Request, res: Response) {
  const order = await orderService.create({
    userId: req.user!.id,
    shippingAddress: req.body.shippingAddress,
    items: req.body.items,
    paymentMethod: req.body.paymentMethod,
    couponCode: req.body.couponCode
  });
  await cartService.clearCart(req.user!.id);

  return res.status(201).json(order);
}
