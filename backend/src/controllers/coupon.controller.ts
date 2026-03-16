import { Request, Response } from "express";
import { CouponService } from "../services/coupon.service";

const couponService = new CouponService();

export async function listCoupons(_req: Request, res: Response) {
  const data = await couponService.list();
  return res.json(data);
}

