import { env } from "../config/env";
import { AppError } from "../utils/app-error";

export class PaymentService {
  async createIntent(method: "razorpay" | "stripe" | "cod", amount: number) {
    if (method === "cod") {
      return { provider: "cod", status: "pending_confirmation", amount };
    }

    if (method === "stripe") {
      if (!env.stripeSecretKey && env.nodeEnv === "production") {
        throw new AppError("Stripe is not configured for this deployment", 503);
      }

      return {
        provider: "stripe",
        configured: Boolean(env.stripeSecretKey),
        clientSecret: env.stripeSecretKey ? "stripe_client_secret_placeholder" : null,
        amount
      };
    }

    if (!env.razorpayKeyId || !env.razorpayKeySecret) {
      if (env.nodeEnv === "production") {
        throw new AppError("Razorpay is not configured for this deployment", 503);
      }
    }

    return {
      provider: "razorpay",
      configured: Boolean(env.razorpayKeyId && env.razorpayKeySecret),
      orderId: env.razorpayKeyId ? "razorpay_order_placeholder" : null,
      amount
    };
  }
}

