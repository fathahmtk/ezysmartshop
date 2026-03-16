"use client";

import { CartState, CheckoutQuote, OrderRecord } from "@/utils/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const DEMO_EMAIL = "priya@example.com";
const DEMO_PASSWORD = "Customer@123";

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
  return {
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD
  };
}

export function fetchCart() {
  return authedRequest<CartState>("/cart");
}

export function addCartItem(productId: string, quantity: number) {
  return authedRequest<CartState>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity })
  });
}

export function updateCartItem(itemId: string, quantity: number) {
  return authedRequest<CartState>(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity })
  });
}

export function removeCartItem(itemId: string) {
  return authedRequest<CartState>(`/cart/items/${itemId}`, {
    method: "DELETE"
  });
}

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
