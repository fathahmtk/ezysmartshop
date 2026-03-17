import { OrderRepository, ProductRepository } from "../domain/repositories";
import { CheckoutQuote } from "../models/types";
import { AppError } from "../utils/app-error";
import { createId } from "../utils/id";
import { CouponService } from "./coupon.service";

type CreateOrderInput = {
  userId: string;
  shippingAddress: string;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: "razorpay" | "stripe" | "cod";
  couponCode?: string;
};

type OrderServiceDependencies = {
  orderRepository: OrderRepository;
  productRepository: ProductRepository;
  couponService: CouponService;
};

export class OrderService {
  constructor(private readonly dependencies: OrderServiceDependencies) {}

  async listByUser(userId: string) {
    return this.dependencies.orderRepository.listByUser(userId);
  }

  async getById(userId: string, orderId: string) {
    const order = await this.dependencies.orderRepository.getById(orderId);
    if (!order || order.userId !== userId) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }

  async quote(items: Array<{ productId: string; quantity: number }>, couponCode?: string): Promise<CheckoutQuote> {
    if (!items.length) {
      throw new AppError("Order must include at least one item", 400);
    }

    const normalizedItems: CheckoutQuote["items"] = [];

    for (const item of items) {
      const product = await this.dependencies.productRepository.getById(item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }
      if (item.quantity <= 0) {
        throw new AppError("Quantity must be positive", 400);
      }
      if (item.quantity > product.stock) {
        throw new AppError(`Insufficient stock for ${product.title}`, 400);
      }

      normalizedItems.push({
        productId: product.id,
        title: product.title,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity
      });
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    let discount = 0;
    let appliedCouponCode: string | undefined;

    if (couponCode) {
      const coupon = await this.dependencies.couponService.getValidCoupon(couponCode);
      if (!coupon) {
        throw new AppError("Coupon not found", 404);
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
    await this.dependencies.productRepository.reserveStock(
      quote.items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
    );

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
    return this.dependencies.orderRepository.create(order);
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.getById(userId, orderId);

    if (order.orderStatus !== "created") {
      throw new AppError("Only newly created orders can be cancelled", 400);
    }

    const cancelled = {
      ...order,
      orderStatus: "cancelled" as const,
      paymentStatus: order.paymentMethod === "cod" ? "failed" as const : order.paymentStatus
    };

    return this.dependencies.orderRepository.update(cancelled);
  }
}
