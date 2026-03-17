import { Router } from "express";
import { AppContainer } from "../application/container";
import { createRecommendationController } from "../controllers/recommendation.controller";

export default function createRecommendationRoutes(container: AppContainer) {
  const router = Router();
  const { getRecommendations } = createRecommendationController(container);

  router.get("/recommendations", getRecommendations);

  return router;
}

