import { Router } from "express";
import { getProduct, listCategories, listProducts } from "../controllers/product.controller";

const router = Router();

router.get("/products", listProducts);
router.get("/products/:slug", getProduct);
router.get("/categories", listCategories);

export default router;

