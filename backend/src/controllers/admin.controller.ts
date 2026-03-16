import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { coupons, orders, products, users } from "../data/seed";

const analyticsService = new AnalyticsService();

export async function dashboard(_req: Request, res: Response) {
  const snapshot = await analyticsService.getAdminSnapshot();
  return res.json(snapshot);
}

export async function customers(_req: Request, res: Response) {
  return res.json(users.map(({ password, ...user }) => user));
}

export async function inventory(_req: Request, res: Response) {
  return res.json(products.map((product) => ({ id: product.id, title: product.title, stock: product.stock })));
}

export async function orderReport(_req: Request, res: Response) {
  return res.json(orders);
}

export async function couponList(_req: Request, res: Response) {
  return res.json(coupons);
}

