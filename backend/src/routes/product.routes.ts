import { Router } from "express";
import { AppContainer } from "../application/container";
import { createProductController } from "../controllers/product.controller";

export default function createProductRoutes(container: AppContainer) {
  const router = Router();
  const { getProduct, listCategories, listProducts } = createProductController(container);

  router.get("/products", listProducts);
  router.get("/products/:slug", getProduct);
  router.get("/categories", listCategories);

  return router;
}

