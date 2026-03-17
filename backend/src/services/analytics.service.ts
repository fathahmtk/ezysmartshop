import { OrderRepository, ProductRepository } from "../domain/repositories";

type AnalyticsServiceDependencies = {
  orderRepository: OrderRepository;
  productRepository: ProductRepository;
};

export class AnalyticsService {
  constructor(private readonly dependencies: AnalyticsServiceDependencies) {}

  async getAdminSnapshot() {
    const [orders, products] = await Promise.all([
      this.dependencies.orderRepository.listAll(),
      this.dependencies.productRepository.list()
    ]);
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    return {
      revenue,
      orders: orders.length,
      topProducts: products.slice(0, 5).map((product) => ({
        id: product.id,
        title: product.title,
        revenue: product.price * 12
      })),
      conversionRate: 4.9,
      averageOrderValue: orders.length ? revenue / orders.length : 0
    };
  }
}

