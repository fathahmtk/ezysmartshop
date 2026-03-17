import { Router } from "express";
import { AppContainer } from "../application/container";
import { createAdminController } from "../controllers/admin.controller";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

export default function createAdminRoutes(container: AppContainer) {
  const router = Router();
  const { couponList, customers, dashboard, inventory, orderReport } = createAdminController(container);

  router.use(requireAuth, requireAdmin);

  router.get("/admin/dashboard", dashboard);
  router.get("/admin/customers", customers);
  router.get("/admin/inventory", inventory);
  router.get("/admin/orders", orderReport);
  router.get("/admin/coupons", couponList);

  return router;
}

