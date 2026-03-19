import { cache } from "react";
import { categories, products, testimonials } from "@/utils/mock-data";
import {
  isShopifyConfigured,
  getShopifyProducts,
  getShopifyProductByHandle,
  getShopifyCollections
} from "@/utils/shopify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function tryFetch<T>(path: string, fallback: T): Promise<T> {
  if (!apiUrl) return fallback;
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      headers: {
        Accept: "application/json"
      },
      next: { revalidate: 120 }
    });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getFeaturedProducts() {
  return products.slice(0, 6);
}

export function getFlashDeals() {
  return products.filter((product) => product.badge === "Flash Deal").concat(products.slice(7, 9));
}

export const getProducts = cache(async function getProducts() {
  if (isShopifyConfigured()) {
    try {
      return await getShopifyProducts();
    } catch {
      // fall through to custom backend / mock data
    }
  }
  return tryFetch("/products", products);
});

export const getProductBySlug = cache(async function getProductBySlug(slug: string) {
  if (isShopifyConfigured()) {
    try {
      return await getShopifyProductByHandle(slug);
    } catch {
      // fall through to custom backend / mock data
    }
  }
  return tryFetch(`/products/${slug}`, products.find((product) => product.slug === slug));
});

export const getCategories = cache(async function getCategories() {
  if (isShopifyConfigured()) {
    try {
      return await getShopifyCollections();
    } catch {
      // fall through to custom backend / mock data
    }
  }
  return tryFetch("/categories", categories);
});

export function getTestimonials() {
  return testimonials;
}
