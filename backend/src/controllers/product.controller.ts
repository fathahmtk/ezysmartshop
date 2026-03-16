import { Request, Response } from "express";
import { Product } from "../models/types";
import { ProductService } from "../services/product.service";
import { categories } from "../data/seed";
import { getCacheValue, setCacheValue } from "../services/cache.service";

const productService = new ProductService();

export async function listProducts(req: Request, res: Response) {
  const query = typeof req.query.q === "string" ? req.query.q : undefined;
  const cacheKey = `products:${query || "all"}`;
  const cached = await getCacheValue<Product[]>(cacheKey);
  if (cached) return res.json(cached);

  const data = await productService.search(query);
  await setCacheValue(cacheKey, data, 180);
  return res.json(data);
}

export async function getProduct(req: Request, res: Response) {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const cacheKey = `product:${slug}`;
  const cached = await getCacheValue<Product>(cacheKey);
  if (cached) return res.json(cached);

  const product = await productService.getBySlug(slug);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await setCacheValue(cacheKey, product, 300);
  return res.json(product);
}

export async function listCategories(_req: Request, res: Response) {
  const cacheKey = "categories";
  const cached = await getCacheValue<typeof categories>(cacheKey);
  if (cached) return res.json(cached);

  await setCacheValue(cacheKey, categories, 900);
  return res.json(categories);
}
