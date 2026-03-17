import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ezysmartshop.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EZY Smart Shop",
    template: "%s | EZY Smart Shop"
  },
  description: "Modern smart gadgets and home utility products built for fast delivery across India.",
  keywords: ["smart gadgets", "home utility products", "workspace accessories", "car accessories India", "ecommerce"],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "EZY Smart Shop",
    description: "Shop premium smart gadgets, home utility products, and conversion-focused bundles.",
    url: siteUrl,
    siteName: "EZY Smart Shop",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "EZY Smart Shop",
    description: "Smart gadgets and home utility products for India."
  },
  category: "shopping"
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EZY Smart Shop",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EZY Smart Shop",
  url: siteUrl,
  sameAs: [siteUrl]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <CartProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
