import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ezysmartshop.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/account", "/admin", "/order-success"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
