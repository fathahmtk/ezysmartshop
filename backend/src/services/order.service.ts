import { coupons, orders, products } from "../data/seed";
import { CheckoutQuote } from "../models/types";
import { AppError } from "../utils/app-error";
import { createId } from "../utils/id";

type CreateOrderInput = {
  userId: string;
  shippingAddress: string;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: "razorpay" | "stripe" | "cod";
  couponCode?: string;
};

export class OrderService {
  async listByUser(userId: string) {
    return orders.filter((order) => order.userId === userId);
  }

  async quote(items: Array<{ productId: string; quantity: number }>, couponCode?: string): Promise<CheckoutQuote> {
    if (!items.length) {
      throw new AppError("Order must include at least one item", 400);
    }

    const normalizedItems = items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }
      if (item.quantity <= 0) {
        throw new AppError("Quantity must be positive", 400);
      }
      if (item.quantity > product.stock) {
        throw new AppError(`Insufficient stock for ${product.title}`, 400);
      }

      return {
        productId: product.id,
        title: product.title,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity
      };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    let discount = 0;
    let appliedCouponCode: string | undefined;

    if (couponCode) {
      const coupon = coupons.find((entry) => entry.code.toLowerCase() === couponCode.toLowerCase());
      if (!coupon) {
        throw new AppError("Coupon not found", 404);
      }
      if (new Date(coupon.expiry).getTime() < Date.now()) {
        throw new AppError("Coupon has expired", 400);
      }

      appliedCouponCode = coupon.code;
      discount =
        coupon.type === "percentage"
          ? Math.round((subtotal * coupon.discount) / 100)
          : coupon.discount;
    }

    discount = Math.min(discount, subtotal);

    return {
      items: normalizedItems,
      subtotal,
      discount,
      total: subtotal - discount,
      couponCode: appliedCouponCode
    };
  }

  async create(input: CreateOrderInput) {
    const quote = await this.quote(input.items, input.couponCode);

    for (const item of quote.items) {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        throw new AppError("Product not found during order creation", 404);
      }
      product.stock -= item.quantity;
    }

    const order = {
      id: createId("ORD"),
      userId: input.userId,
      subtotal: quote.subtotal,
      discount: quote.discount,
      total: quote.total,
      couponCode: quote.couponCode,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "cod" ? "pending" as const : "paid" as const,
      orderStatus: "created" as const,
      shippingAddress: input.shippingAddress,
      items: quote.items.map((item) => ({
        id: createId("itm"),
        productId: item.productId,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      createdAt: new Date().toISOString()
    };
    orders.unshift(order);
    return order;
  }
}
