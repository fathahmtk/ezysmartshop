import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

export async function getCart(req: Request, res: Response) {
  const cart = await cartService.getCart(req.user!.id);
  return res.json(cart);
}

export async function addCartItem(req: Request, res: Response) {
  const cart = await cartService.addItem(req.user!.id, req.body.productId, req.body.quantity);
  return res.status(201).json(cart);
}

export async function updateCartItem(req: Request, res: Response) {
  const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
  const cart = await cartService.updateItem(req.user!.id, itemId, req.body.quantity);
  return res.json(cart);
}

export async function removeCartItem(req: Request, res: Response) {
  const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
  const cart = await cartService.removeItem(req.user!.id, itemId);
  return res.json(cart);
}
