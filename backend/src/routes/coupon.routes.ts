import { Router } from "express";
import { AppContainer } from "../application/container";
import { createCouponController } from "../controllers/coupon.controller";

export default function createCouponRoutes(container: AppContainer) {
  const router = Router();
  const { listCoupons } = createCouponController(container);

  router.get("/coupons", listCoupons);

  return router;
}

