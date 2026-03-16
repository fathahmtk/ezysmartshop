import { Router } from "express";
import { getRecommendations } from "../controllers/recommendation.controller";

const router = Router();

router.get("/recommendations", getRecommendations);

export default router;

