import { AnalyticsService } from "../services/analytics.service";
import { AuthService } from "../services/auth.service";
import { CartService } from "../services/cart.service";
import { CouponService } from "../services/coupon.service";
import { OrderService } from "../services/order.service";
import { PaymentService } from "../services/payment.service";
import { ProductService } from "../services/product.service";
import { RecommendationService } from "../services/recommendation.service";
import { InMemoryStore } from "../infrastructure/persistence/in-memory/store";
import {
  InMemoryCartRepository,
  InMemoryCategoryRepository,
  InMemoryCouponRepository,
  InMemoryOrderRepository,
  InMemoryProductRepository,
  InMemoryUserRepository
} from "../infrastructure/persistence/in-memory/repositories";

export type AppContainer = ReturnType<typeof createAppContainer>;

export function createAppContainer() {
  const store = new InMemoryStore();

  const userRepository = new InMemoryUserRepository(store);
  const categoryRepository = new InMemoryCategoryRepository(store);
  const productRepository = new InMemoryProductRepository(store);
  const cartRepository = new InMemoryCartRepository(store);
  const couponRepository = new InMemoryCouponRepository(store);
  const orderRepository = new InMemoryOrderRepository(store);

  const couponService = new CouponService({ couponRepository });
  const productService = new ProductService({ productRepository, categoryRepository });
  const cartService = new CartService({ cartRepository, productRepository });
  const orderService = new OrderService({ orderRepository, productRepository, couponService });
  const analyticsService = new AnalyticsService({ orderRepository, productRepository });
  const authService = new AuthService({ userRepository });
  const paymentService = new PaymentService();
  const recommendationService = new RecommendationService({ productRepository });

  return {
    repositories: {
      userRepository,
      categoryRepository,
      productRepository,
      cartRepository,
      couponRepository,
      orderRepository
    },
    services: {
      authService,
      productService,
      cartService,
      orderService,
      paymentService,
      couponService,
      analyticsService,
      recommendationService
    }
  };
}
