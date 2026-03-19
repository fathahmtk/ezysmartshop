"use client";

import { CartState, CheckoutQuote, OrderRecord } from "@/utils/types";
import {
  isShopifyConfigured,
  createShopifyCart,
  addShopifyCartLines,
  updateShopifyCartLines,
  removeShopifyCartLines,
  fetchShopifyCart,
  mapShopifyCart
} from "@/utils/shopify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
const DEMO_EMAIL = "priya@example.com";
const DEMO_PASSWORD = "Customer@123";

// ─── Shopify cart helpers ────────────────────────────────────────────────────

const SHOPIFY_CART_ID_KEY = "shopify_cart_id";

function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SHOPIFY_CART_ID_KEY);
  } catch {
    return null;
  }
}

function storeCartId(cartId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SHOPIFY_CART_ID_KEY, cartId);
  } catch {
    // localStorage may be unavailable in some contexts
  }
}

function clearStoredCartId(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SHOPIFY_CART_ID_KEY);
  } catch {
    // ignore
  }
}

async function getOrCreateShopifyCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = []
): Promise<ReturnType<typeof mapShopifyCart>> {
  const existingId = getStoredCartId();
  if (existingId) {
    const cart = await fetchShopifyCart(existingId);
    if (cart) return mapShopifyCart(cart);
    // cart no longer exists on Shopify — create a new one
    clearStoredCartId();
  }
  const newCart = await createShopifyCart(lines);
  storeCartId(newCart.id);
  return mapShopifyCart(newCart);
}

// ─── Custom backend helpers ──────────────────────────────────────────────────

let csrfTokenCache: string | null = null;
let loginPromise: Promise<void> | null = null;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function getCsrfToken() {
  if (csrfTokenCache) return csrfTokenCache;
  const response = await request<{ csrfToken: string }>("/csrf-token");
  csrfTokenCache = response.csrfToken;
  return csrfTokenCache;
}

export async function ensureDemoSession() {
  if (!DEMO_MODE) {
    throw new Error("Demo storefront mode is disabled for this deployment");
  }

  if (!loginPromise) {
    loginPromise = (async () => {
      await getCsrfToken();
      await request("/login", {
        method: "POST",
        body: JSON.stringify({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD
        })
      });
    })().catch((error) => {
      loginPromise = null;
      throw error;
    });
  }

  await loginPromise;
}

async function authedRequest<T>(path: string, init?: RequestInit): Promise<T> {
  await ensureDemoSession();
  const csrfToken = await getCsrfToken();

  return request<T>(path, {
    ...init,
    headers: {
      "x-csrf-token": csrfToken,
      ...(init?.headers || {})
    }
  });
}

export function getDemoCredentials() {
  if (!DEMO_MODE) {
    return null;
  }

  return {
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD
  };
}

// ─── Cart API (Shopify or custom backend) ────────────────────────────────────

export async function fetchCart(): Promise<CartState> {
  if (isShopifyConfigured()) {
    const cartId = getStoredCartId();
    if (!cartId) {
      // No cart yet — return an empty cart state
      return { id: "", userId: "", items: [] };
    }
    const cart = await fetchShopifyCart(cartId);
    if (!cart) {
      clearStoredCartId();
      return { id: "", userId: "", items: [] };
    }
    return mapShopifyCart(cart);
  }
  return authedRequest<CartState>("/cart");
}

export async function addCartItem(productId: string, quantity: number): Promise<CartState> {
  if (isShopifyConfigured()) {
    const cartId = getStoredCartId();
    const line = { merchandiseId: productId, quantity };
    if (!cartId) {
      return getOrCreateShopifyCart([line]);
    }
    const existingCart = await fetchShopifyCart(cartId);
    if (!existingCart) {
      clearStoredCartId();
      return getOrCreateShopifyCart([line]);
    }
    const updated = await addShopifyCartLines(cartId, [line]);
    storeCartId(updated.id);
    return mapShopifyCart(updated);
  }
  return authedRequest<CartState>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity })
  });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartState> {
  if (isShopifyConfigured()) {
    const cartId = getStoredCartId();
    if (!cartId) return { id: "", userId: "", items: [] };
    if (quantity <= 0) {
      const updated = await removeShopifyCartLines(cartId, [itemId]);
      return mapShopifyCart(updated);
    }
    const updated = await updateShopifyCartLines(cartId, [{ id: itemId, quantity }]);
    return mapShopifyCart(updated);
  }
  return authedRequest<CartState>(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity })
  });
}

export async function removeCartItem(itemId: string): Promise<CartState> {
  if (isShopifyConfigured()) {
    const cartId = getStoredCartId();
    if (!cartId) return { id: "", userId: "", items: [] };
    const updated = await removeShopifyCartLines(cartId, [itemId]);
    return mapShopifyCart(updated);
  }
  return authedRequest<CartState>(`/cart/items/${itemId}`, {
    method: "DELETE"
  });
}

export async function clearCart(): Promise<CartState> {
  if (isShopifyConfigured()) {
    const cartId = getStoredCartId();
    if (!cartId) return { id: "", userId: "", items: [] };
    const cart = await fetchShopifyCart(cartId);
    if (!cart || !cart.lines.edges.length) return { id: cartId, userId: "", items: [] };
    const lineIds = cart.lines.edges.map(({ node }) => node.id);
    const updated = await removeShopifyCartLines(cartId, lineIds);
    return mapShopifyCart(updated);
  }
  return authedRequest<CartState>("/cart", {
    method: "DELETE"
  });
}

// ─── Order / Payment API (custom backend only) ───────────────────────────────

export function fetchQuote(items: Array<{ productId: string; quantity: number }>, couponCode?: string) {
  return authedRequest<CheckoutQuote>("/orders/quote", {
    method: "POST",
    body: JSON.stringify({ items, couponCode })
  });
}

export function createPaymentIntent(method: "razorpay" | "stripe" | "cod", items: Array<{ productId: string; quantity: number }>, couponCode?: string) {
  return authedRequest<{ provider: string; amount: number; status?: string; configured?: boolean; orderId?: string | null; clientSecret?: string | null }>(
    "/payments/intent",
    {
      method: "POST",
      body: JSON.stringify({ method, items, couponCode })
    }
  );
}

export function createOrder(payload: {
  shippingAddress: string;
  paymentMethod: "razorpay" | "stripe" | "cod";
  couponCode?: string;
  items: Array<{ productId: string; quantity: number }>;
}) {
  return authedRequest<OrderRecord>("/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchOrders() {
  return authedRequest<OrderRecord[]>("/orders");
}

export function fetchOrder(orderId: string) {
  return authedRequest<OrderRecord>(`/orders/${orderId}`);
}

export function cancelOrder(orderId: string) {
  return authedRequest<OrderRecord>(`/orders/${orderId}/cancel`, {
    method: "PATCH"
  });
}
