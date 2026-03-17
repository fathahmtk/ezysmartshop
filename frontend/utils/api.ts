import { cache } from "react";
import { categories, products, testimonials } from "@/utils/mock-data";

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
  return tryFetch("/products", products);
});

export const getProductBySlug = cache(async function getProductBySlug(slug: string) {
  return tryFetch(`/products/${slug}`, products.find((product) => product.slug === slug));
});

export const getCategories = cache(async function getCategories() {
  return tryFetch("/categories", categories);
});

export function getTestimonials() {
  return testimonials;
}
