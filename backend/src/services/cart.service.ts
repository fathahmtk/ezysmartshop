import { products } from "../data/seed";
import { AppError } from "../utils/app-error";
import { createId } from "../utils/id";

const carts = [
  {
    id: "cart-1",
    userId: "usr-customer",
    items: [
      { id: "ci-1", cartId: "cart-1", productId: "prd-2", quantity: 1 },
      { id: "ci-2", cartId: "cart-1", productId: "prd-1", quantity: 2 }
    ]
  }
];

export class CartService {
  async getCart(userId: string) {
    let cart = carts.find((entry) => entry.userId === userId);

    if (!cart) {
      cart = { id: createId("cart"), userId, items: [] };
      carts.push(cart);
    }

    return {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: products.find((product) => product.id === item.productId) || null
      }))
    };
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = products.find((entry) => entry.id === productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    if (quantity > product.stock) {
      throw new AppError("Requested quantity exceeds available stock", 400);
    }

    let cart = carts.find((entry) => entry.userId === userId);
    if (!cart) {
      cart = { id: createId("cart"), userId, items: [] };
      carts.push(cart);
    }

    const existing = cart.items.find((item) => item.productId === productId);
    if (existing) {
      if (existing.quantity + quantity > product.stock) {
        throw new AppError("Requested quantity exceeds available stock", 400);
      }
      existing.quantity += quantity;
    } else {
      cart.items.push({ id: createId("ci"), cartId: cart.id, productId, quantity });
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = carts.find((entry) => entry.userId === userId);
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    const item = cart.items.find((entry) => entry.id === itemId);
    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    if (quantity <= 0) {
      cart.items = cart.items.filter((entry) => entry.id !== itemId);
      return this.getCart(userId);
    }
    if (quantity > product.stock) {
      throw new AppError("Requested quantity exceeds available stock", 400);
    }

    item.quantity = quantity;
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = carts.find((entry) => entry.userId === userId);
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    cart.items = cart.items.filter((entry) => entry.id !== itemId);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = carts.find((entry) => entry.userId === userId);
    if (!cart) {
      return { id: createId("cart"), userId, items: [] };
    }

    cart.items = [];
    return this.getCart(userId);
  }
}
