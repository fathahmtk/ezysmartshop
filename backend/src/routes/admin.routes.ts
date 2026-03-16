import { Router } from "express";
import { couponList, customers, dashboard, inventory, orderReport } from "../controllers/admin.controller";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/admin/dashboard", dashboard);
router.get("/admin/customers", customers);
router.get("/admin/inventory", inventory);
router.get("/admin/orders", orderReport);
router.get("/admin/coupons", couponList);

export default router;

