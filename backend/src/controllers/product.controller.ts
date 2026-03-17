import { Request, Response } from "express";
import { AppContainer } from "../application/container";
import { Product } from "../models/types";
import { getCacheValue, setCacheValue } from "../services/cache.service";

export function createProductController(container: AppContainer) {
  const { productService } = container.services;

  return {
    listProducts: async (req: Request, res: Response) => {
      const query = typeof req.query.q === "string" ? req.query.q : undefined;
      const cacheKey = `products:${query || "all"}`;
      res.set("Cache-Control", query ? "public, max-age=60, s-maxage=120, stale-while-revalidate=300" : "public, max-age=180, s-maxage=300, stale-while-revalidate=600");
      const cached = await getCacheValue<Product[]>(cacheKey);
      if (cached) return res.json(cached);

      const data = await productService.search(query);
      await setCacheValue(cacheKey, data, 180);
      return res.json(data);
    },

    getProduct: async (req: Request, res: Response) => {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const cacheKey = `product:${slug}`;
      res.set("Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=1800");
      const cached = await getCacheValue<Product>(cacheKey);
      if (cached) return res.json(cached);

      const product = await productService.getBySlug(slug);
      if (!product) return res.status(404).json({ message: "Product not found" });
      await setCacheValue(cacheKey, product, 300);
      return res.json(product);
    },

    listCategories: async (_req: Request, res: Response) => {
      const cacheKey = "categories";
      res.set("Cache-Control", "public, max-age=900, s-maxage=1800, stale-while-revalidate=3600");
      const cached = await getCacheValue(cacheKey);
      if (cached) return res.json(cached);

      const categories = await productService.listCategories();
      await setCacheValue(cacheKey, categories, 900);
      return res.json(categories);
    }
  };
}
