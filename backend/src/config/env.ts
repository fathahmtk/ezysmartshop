import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || "replace-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  secureCookies: process.env.NODE_ENV === "production",
  redisUrl: process.env.REDIS_URL || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  geminiApiKey: process.env.GEMINI_API_KEY || ""
};
