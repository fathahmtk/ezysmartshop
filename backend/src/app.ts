import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createAppContainer } from "./application/container";
import { attachRequestId } from "./middleware/request-id.middleware";
import { logRequests } from "./middleware/request-logging.middleware";
import createAuthRoutes from "./routes/auth.routes";
import createProductRoutes from "./routes/product.routes";
import createCartRoutes from "./routes/cart.routes";
import createOrderRoutes from "./routes/order.routes";
import createPaymentRoutes from "./routes/payment.routes";
import createAdminRoutes from "./routes/admin.routes";
import createRecommendationRoutes from "./routes/recommendation.routes";
import { issueCsrfToken, verifyCsrfToken } from "./middleware/csrf.middleware";
import createCouponRoutes from "./routes/coupon.routes";
import { errorHandler } from "./middleware/error.middleware";
import { env } from "./config/env";
import { getRedisClient } from "./services/cache.service";

export function createApp() {
  const app = express();
  const container = createAppContainer();
  app.disable("x-powered-by");

  app.use(attachRequestId);
  app.use(logRequests);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Origin not allowed by CORS"));
      },
      credentials: true
    })
  );
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(issueCsrfToken);
  app.use(verifyCsrfToken);

  app.get("/health", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ status: "ok" });
  });

  app.get("/ready", async (_req, res, next) => {
    try {
      const redis = await getRedisClient();
      res.set("Cache-Control", "no-store");
      res.json({
        status: "ok",
        environment: env.nodeEnv,
        demoMode: env.demoMode,
        services: {
          redis: env.redisUrl ? (redis ? "up" : "down") : "disabled"
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken });
  });

  app.use("/api", createAuthRoutes(container));
  app.use("/api", createProductRoutes(container));
  app.use("/api", createCartRoutes(container));
  app.use("/api", createOrderRoutes(container));
  app.use("/api", createPaymentRoutes(container));
  app.use("/api", createAdminRoutes(container));
  app.use("/api", createRecommendationRoutes(container));
  app.use("/api", createCouponRoutes(container));

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use(errorHandler);

  return app;
}
