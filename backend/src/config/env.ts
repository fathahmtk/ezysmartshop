import dotenv from "dotenv";
import { z } from "zod";
import { assertValidJwtSecret, DEFAULT_JWT_SECRET } from "./jwt-secret";

dotenv.config({ path: "../.env" });
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DEMO_MODE: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value !== "false"),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  ALLOWED_ORIGINS: z.string().optional(),
  JWT_SECRET: z.string().trim().min(1).default(DEFAULT_JWT_SECRET),
  JWT_EXPIRES_IN: z.string().trim().min(1).default("7d"),
  COOKIE_DOMAIN: z.string().trim().optional(),
  REDIS_URL: z.string().trim().optional(),
  STRIPE_SECRET_KEY: z.string().trim().optional(),
  RAZORPAY_KEY_ID: z.string().trim().optional(),
  RAZORPAY_KEY_SECRET: z.string().trim().optional(),
  GEMINI_API_KEY: z.string().trim().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info")
});

const parsed = envSchema.parse(process.env);
const nodeEnv = parsed.NODE_ENV;
const demoMode = parsed.DEMO_MODE;
const jwtSecret = parsed.JWT_SECRET;

assertValidJwtSecret(nodeEnv, jwtSecret, demoMode);

export const env = {
  port: parsed.PORT,
  nodeEnv,
  demoMode,
  clientUrl: parsed.CLIENT_URL,
  allowedOrigins: (parsed.ALLOWED_ORIGINS || parsed.CLIENT_URL)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  jwtSecret,
  jwtExpiresIn: parsed.JWT_EXPIRES_IN,
  cookieDomain: parsed.COOKIE_DOMAIN || undefined,
  secureCookies: nodeEnv === "production",
  redisUrl: parsed.REDIS_URL || "",
  stripeSecretKey: parsed.STRIPE_SECRET_KEY || "",
  razorpayKeyId: parsed.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: parsed.RAZORPAY_KEY_SECRET || "",
  geminiApiKey: parsed.GEMINI_API_KEY || "",
  logLevel: parsed.LOG_LEVEL
};
