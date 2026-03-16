import { orders, products } from "../data/seed";

export class AnalyticsService {
  async getAdminSnapshot() {
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

