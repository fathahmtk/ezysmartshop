import { Cart, Category, Order, Product } from "../../../models/types";
import { AppError } from "../../../utils/app-error";
import { createId } from "../../../utils/id";
import {
  CartRepository,
  CartWithProducts,
  CategoryRepository,
  CouponRepository,
  NewUser,
  OrderRepository,
  ProductRepository,
  PublicUser,
  UserRepository
} from "../../../domain/repositories";
import { InMemoryStore } from "./store";

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly store: InMemoryStore) {}

  async findByEmail(email: string) {
    return this.store.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async create(input: NewUser) {
    const user = {
      id: createId("usr"),
      createdAt: new Date().toISOString(),
      ...input
    };
    this.store.users.push(user);
    return user;
  }

  async listPublic(): Promise<PublicUser[]> {
    return this.store.users.map(({ password, ...user }) => user);
  }
}

export class InMemoryCategoryRepository implements CategoryRepository {
  constructor(private readonly store: InMemoryStore) {}

  async list(): Promise<Category[]> {
    return this.store.categories.map((entry) => ({ ...entry }));
  }
}

export class InMemoryProductRepository implements ProductRepository {
  constructor(private readonly store: InMemoryStore) {}

  async list(): Promise<Product[]> {
    return this.store.products.map(cloneProduct);
  }

  async search(query?: string): Promise<Product[]> {
    if (!query) return this.list();

    const normalized = query.toLowerCase();
    return this.store.products
      .filter((product) =>
        [product.title, product.description, product.category].some((field) => field.toLowerCase().includes(normalized))
      )
      .map(cloneProduct);
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const product = this.store.products.find((entry) => entry.slug === slug);
    return product ? cloneProduct(product) : null;
  }

  async getById(id: string): Promise<Product | null> {
    const product = this.store.products.find((entry) => entry.id === id);
    return product ? cloneProduct(product) : null;
  }

  async reserveStock(items: Array<{ productId: string; quantity: number }>) {
    for (const item of items) {
      const product = this.store.products.find((entry) => entry.id === item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }
      if (item.quantity > product.stock) {
        throw new AppError(`Insufficient stock for ${product.title}`, 400);
      }
    }

    for (const item of items) {
      const product = this.store.products.find((entry) => entry.id === item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }
      product.stock -= item.quantity;
    }
  }

  async listInventory() {
    return this.store.products.map((product) => ({
      id: product.id,
      title: product.title,
      stock: product.stock
    }));
  }
}

export class InMemoryCartRepository implements CartRepository {
  constructor(private readonly store: InMemoryStore) {}

  async getByUserId(userId: string): Promise<CartWithProducts> {
    let cart = this.store.carts.find((entry) => entry.userId === userId);

    if (!cart) {
      cart = { id: createId("cart"), userId, items: [] };
      this.store.carts.push(cart);
    }

    return {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: this.store.products.find((product) => product.id === item.productId) || null
      }))
    };
  }

  async save(cart: Cart) {
    const index = this.store.carts.findIndex((entry) => entry.id === cart.id);
    if (index >= 0) {
      this.store.carts[index] = {
        ...cart,
        items: cart.items.map((item) => ({ ...item }))
      };
      return;
    }

    this.store.carts.push({
      ...cart,
      items: cart.items.map((item) => ({ ...item }))
    });
  }

  async clear(userId: string) {
    const cart = await this.getByUserId(userId);
    await this.save({ id: cart.id, userId, items: [] });
    return this.getByUserId(userId);
  }
}

export class InMemoryCouponRepository implements CouponRepository {
  constructor(private readonly store: InMemoryStore) {}

  async list() {
    return this.store.coupons.map((entry) => ({ ...entry }));
  }

  async findByCode(code: string) {
    return this.store.coupons.find((entry) => entry.code.toLowerCase() === code.toLowerCase()) || null;
  }
}

export class InMemoryOrderRepository implements OrderRepository {
  constructor(private readonly store: InMemoryStore) {}

  async listByUser(userId: string) {
    return this.store.orders.filter((entry) => entry.userId === userId).map(cloneOrder);
  }

  async listAll() {
    return this.store.orders.map(cloneOrder);
  }

  async getById(orderId: string) {
    const order = this.store.orders.find((entry) => entry.id === orderId);
    return order ? cloneOrder(order) : null;
  }

  async create(order: Order) {
    const created = cloneOrder(order);
    this.store.orders.unshift(created);
    return cloneOrder(created);
  }

  async update(order: Order) {
    const index = this.store.orders.findIndex((entry) => entry.id === order.id);
    if (index < 0) {
      throw new AppError(`Order ${order.id} not found`, 404);
    }

    const updated = cloneOrder(order);
    this.store.orders[index] = updated;
    return cloneOrder(updated);
  }
}

function cloneProduct(product: Product): Product {
  return {
    ...product,
    images: [...product.images],
    specifications: [...product.specifications],
    shippingDetails: [...product.shippingDetails]
  };
}

function cloneOrder(order: Order): Order {
  return {
    ...order,
    items: order.items.map((item) => ({ ...item }))
  };
}
