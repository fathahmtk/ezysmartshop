import { Router } from "express";
import { listCoupons } from "../controllers/coupon.controller";

const router = Router();

router.get("/coupons", listCoupons);

export default router;

