import { CategoryRepository, ProductRepository } from "../domain/repositories";

type ProductServiceDependencies = {
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
};

export class ProductService {
  constructor(private readonly dependencies: ProductServiceDependencies) {}

  async list() {
    return this.dependencies.productRepository.list();
  }

  async getBySlug(slug: string) {
    return this.dependencies.productRepository.getBySlug(slug);
  }

  async search(query?: string) {
    return this.dependencies.productRepository.search(query);
  }

  async listCategories() {
    return this.dependencies.categoryRepository.list();
  }
}

