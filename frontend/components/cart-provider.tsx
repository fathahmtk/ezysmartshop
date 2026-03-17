"use client";

import { createContext, useCallback, useContext, useEffect, useState, useTransition } from "react";
import { addCartItem, clearCart as clearCartRequest, fetchCart, removeCartItem, updateCartItem } from "@/utils/client-api";
import { CartState } from "@/utils/types";

type CartContextValue = {
  cart: CartState | null;
  cartCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState | null>(null);
  const [isPending, startTransition] = useTransition();

  const refreshCart = useCallback(async () => {
    const nextCart = await fetchCart();
    setCart(nextCart);
  }, []);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    const nextCart = await addCartItem(productId, quantity);
    setCart(nextCart);
  }, []);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    const nextCart = await updateCartItem(itemId, quantity);
    setCart(nextCart);
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    const nextCart = await removeCartItem(itemId);
    setCart(nextCart);
  }, []);

  const clearCart = useCallback(async () => {
    const nextCart = await clearCartRequest();
    setCart(nextCart);
  }, []);

  useEffect(() => {
    startTransition(async () => {
      try {
        await refreshCart();
      } catch {
        setCart(null);
      }
    });
  }, [refreshCart]);

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading: isPending && !cart,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
