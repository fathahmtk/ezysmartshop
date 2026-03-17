import { Request, Response } from "express";
import { AppContainer } from "../application/container";
import { getCacheValue, setCacheValue } from "../services/cache.service";

export function createRecommendationController(container: AppContainer) {
  const { recommendationService } = container.services;

  return {
    getRecommendations: async (req: Request, res: Response) => {
      const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
      const cacheKey = `recommendations:${productId || "homepage"}`;
      res.set("Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=1800");
      const cached = await getCacheValue(cacheKey);
      if (cached) return res.json(cached);

      const data = await recommendationService.getRecommendations(productId);
      await setCacheValue(cacheKey, data, 300);
      return res.json(data);
    }
  };
}
