import { env } from "../config/env";

export class PaymentService {
  async createIntent(method: "razorpay" | "stripe" | "cod", amount: number) {
    if (method === "cod") {
      return { provider: "cod", status: "pending_confirmation", amount };
    }

    if (method === "stripe") {
      return {
        provider: "stripe",
        configured: Boolean(env.stripeSecretKey),
        clientSecret: env.stripeSecretKey ? "stripe_client_secret_placeholder" : null,
        amount
      };
    }

    return {
      provider: "razorpay",
      configured: Boolean(env.razorpayKeyId && env.razorpayKeySecret),
      orderId: env.razorpayKeyId ? "razorpay_order_placeholder" : null,
      amount
    };
  }
}

