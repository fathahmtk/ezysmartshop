import { products } from "../data/seed";

export class ProductService {
  async list() {
    return products;
  }

  async getBySlug(slug: string) {
    return products.find((product) => product.slug === slug) || null;
  }

  async search(query?: string) {
    if (!query) return products;
    const normalized = query.toLowerCase();
    return products.filter((product) =>
      [product.title, product.description, product.category].some((field) => field.toLowerCase().includes(normalized))
    );
  }
}

