import { Cart, Category, Coupon, Order, Product, User } from "../models/types";

export type NewUser = Omit<User, "id" | "createdAt">;

export type PublicUser = Omit<User, "password">;

export type CartWithProducts = Cart & {
  items: Array<Cart["items"][number] & { product: Product | null }>;
};

export type InventoryItem = {
  id: string;
  title: string;
  stock: number;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(input: NewUser): Promise<User>;
  listPublic(): Promise<PublicUser[]>;
}

export interface CategoryRepository {
  list(): Promise<Category[]>;
}

export interface ProductRepository {
  list(): Promise<Product[]>;
  search(query?: string): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  reserveStock(items: Array<{ productId: string; quantity: number }>): Promise<void>;
  listInventory(): Promise<InventoryItem[]>;
}

export interface CartRepository {
  getByUserId(userId: string): Promise<CartWithProducts>;
  save(cart: Cart): Promise<void>;
  clear(userId: string): Promise<CartWithProducts>;
}

export interface CouponRepository {
  list(): Promise<Coupon[]>;
  findByCode(code: string): Promise<Coupon | null>;
}

export interface OrderRepository {
  listByUser(userId: string): Promise<Order[]>;
  listAll(): Promise<Order[]>;
  getById(orderId: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
}
