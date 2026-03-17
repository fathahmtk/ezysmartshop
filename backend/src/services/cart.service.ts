import { CartRepository, ProductRepository } from "../domain/repositories";
import { AppError } from "../utils/app-error";
import { createId } from "../utils/id";

type CartServiceDependencies = {
  cartRepository: CartRepository;
  productRepository: ProductRepository;
};

export class CartService {
  constructor(private readonly dependencies: CartServiceDependencies) {}

  async getCart(userId: string) {
    return this.dependencies.cartRepository.getByUserId(userId);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.dependencies.productRepository.getById(productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    if (quantity > product.stock) {
      throw new AppError("Requested quantity exceeds available stock", 400);
    }

    const currentCart = await this.dependencies.cartRepository.getByUserId(userId);
    const cart = {
      id: currentCart.id,
      userId,
      items: currentCart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    const existing = cart.items.find((item) => item.productId === productId);
    if (existing) {
      if (existing.quantity + quantity > product.stock) {
        throw new AppError("Requested quantity exceeds available stock", 400);
      }
      existing.quantity += quantity;
    } else {
      cart.items.push({ id: createId("ci"), cartId: cart.id, productId, quantity });
    }

    await this.dependencies.cartRepository.save(cart);
    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const currentCart = await this.dependencies.cartRepository.getByUserId(userId);
    const cart = {
      id: currentCart.id,
      userId,
      items: currentCart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    const item = cart.items.find((entry) => entry.id === itemId);
    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    const product = await this.dependencies.productRepository.getById(item.productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    if (quantity <= 0) {
      cart.items = cart.items.filter((entry) => entry.id !== itemId);
      await this.dependencies.cartRepository.save(cart);
      return this.getCart(userId);
    }
    if (quantity > product.stock) {
      throw new AppError("Requested quantity exceeds available stock", 400);
    }

    item.quantity = quantity;
    await this.dependencies.cartRepository.save(cart);
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const currentCart = await this.dependencies.cartRepository.getByUserId(userId);
    const cart = {
      id: currentCart.id,
      userId,
      items: currentCart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    cart.items = cart.items.filter((entry) => entry.id !== itemId);
    await this.dependencies.cartRepository.save(cart);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    return this.dependencies.cartRepository.clear(userId);
  }
}
