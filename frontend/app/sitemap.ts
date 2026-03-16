import { MetadataRoute } from "next";
import { getProducts } from "@/utils/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ezysmartshop.com";
  const products = await getProducts();

  return [
    "",
    "/shop",
    "/cart",
    "/checkout",
    "/account",
    "/admin",
    ...products.map((product) => `/product/${product.slug}`)
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date()
  }));
}

