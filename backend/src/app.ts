import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import { issueCsrfToken, verifyCsrfToken } from "./middleware/csrf.middleware";
import couponRoutes from "./routes/coupon.routes";
import { errorHandler } from "./middleware/error.middleware";
import { env } from "./config/env";

export function createApp() {
  const app = express();

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
    res.json({ status: "ok" });
  });

  app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken });
  });

  app.use("/api", authRoutes);
  app.use("/api", productRoutes);
  app.use("/api", cartRoutes);
  app.use("/api", orderRoutes);
  app.use("/api", paymentRoutes);
  app.use("/api", adminRoutes);
  app.use("/api", recommendationRoutes);
  app.use("/api", couponRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use(errorHandler);

  return app;
}
