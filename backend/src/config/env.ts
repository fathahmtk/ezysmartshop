import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
dotenv.config();

const DEFAULT_JWT_SECRET = "replace-this-secret";
const MIN_JWT_SECRET_LENGTH = 32;

export function assertValidJwtSecret(nodeEnv: string, jwtSecret: string) {
  if (nodeEnv !== "production") {
    return;
  }

  if (jwtSecret === DEFAULT_JWT_SECRET) {
    throw new Error("JWT_SECRET must be set to a strong value in production");
  }

  if (jwtSecret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }
}

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET?.trim() || DEFAULT_JWT_SECRET;

assertValidJwtSecret(nodeEnv, jwtSecret);

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  secureCookies: nodeEnv === "production",
  redisUrl: process.env.REDIS_URL || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  geminiApiKey: process.env.GEMINI_API_KEY || ""
};
