import { Request, Response } from "express";
import { RecommendationService } from "../services/recommendation.service";
import { getCacheValue, setCacheValue } from "../services/cache.service";

const recommendationService = new RecommendationService();

export async function getRecommendations(req: Request, res: Response) {
  const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
  const cacheKey = `recommendations:${productId || "homepage"}`;
  const cached = await getCacheValue(cacheKey);
  if (cached) return res.json(cached);

  const data = await recommendationService.getRecommendations(productId);
  await setCacheValue(cacheKey, data, 300);
  return res.json(data);
}
