import { Request, Response } from "express";
import { AppContainer } from "../application/container";

export function createCouponController(container: AppContainer) {
  const { couponService } = container.services;

  return {
    listCoupons: async (_req: Request, res: Response) => {
      const data = await couponService.list();
      return res.json(data);
    }
  };
}

