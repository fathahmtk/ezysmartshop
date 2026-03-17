import Script from "next/script";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BadgeCheck, ShieldCheck, Star, Timer, Truck } from "lucide-react";
import type { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/utils/api";
import { ProductSection } from "@/components/product-section";
import { ProductActions } from "@/components/product-actions";

type ProductPageParams = {
  slug: string;
};

type ProductPageProps = {
  params: Promise<ProductPageParams>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`
    },
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, products] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();
  const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
  const savings = product.comparePrice - product.price;
  const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 3);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    brand: "EZY Smart Shop",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <section className="container-shell py-8 pb-28 md:py-10 md:pb-10">
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-sm shadow-slate-900/5">
            <div className="relative h-[420px] overflow-hidden bg-[#f6ede2] sm:h-[500px]">
              <Image src={product.images[0]} alt={product.title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Secure purchase", copy: "Protected checkout and visible pricing." },
              { icon: Truck, title: "Fast dispatch", copy: "Core products ship within 24 to 48 hours." },
              { icon: BadgeCheck, title: "Easy support", copy: "Replacement and post-purchase help included." }
            ].map((item) => (
              <div key={item.title} className="surface-card p-4">
                <item.icon className="h-5 w-5 text-orange-600" />
                <p className="mt-3 text-sm font-semibold text-primary">{item.title}</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">{product.category}</p>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              {discount}% off
            </span>
            {product.badge ? (
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {product.badge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary">{product.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Star className="h-4 w-4 fill-current text-amber-400" />
            <span>{product.rating}</span>
            <span>|</span>
            <span>{product.stock} units available</span>
            <span>|</span>
            <span>Fast dispatch</span>
          </div>
          <p className="mt-6 text-base leading-7 text-slate-600">{product.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-semibold text-primary">Rs {product.price}</span>
            <span className="text-lg text-slate-400 line-through">Rs {product.comparePrice}</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Secure checkout
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">You save</p>
              <p className="mt-2 text-lg font-semibold text-primary">Rs {savings}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Expected delivery</p>
              <p className="mt-2 text-lg font-semibold text-primary">3 to 5 days</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Buyer confidence</p>
              <p className="mt-2 text-lg font-semibold text-primary">COD supported</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.75rem] border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <Timer className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-primary">High-intent offer framing</span>
              <span>Save Rs {savings} today and get dispatch priority on prepaid orders.</span>
            </div>
          </div>
          <ProductActions
            productId={product.id}
            title={product.title}
            price={product.price}
            comparePrice={product.comparePrice}
            stock={product.stock}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <p className="font-semibold text-primary">Specifications</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {product.specifications.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-primary">
                <Truck className="h-4 w-4" />
                <p className="font-semibold">Shipping details</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {product.shippingDetails.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-100 bg-white/75 p-5">
              <p className="font-semibold text-primary">What helps this product convert</p>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                <li>Visible discount math lowers comparison friction versus marketplace listings.</li>
                <li>Fast-dispatch messaging reduces hesitation for first-time visitors.</li>
                <li>Quantity and buy-now controls shorten the path from interest to checkout.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white/75 p-5">
              <p className="font-semibold text-primary">Common buyer questions</p>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-primary">Is COD available?</span> Yes, eligible products can be completed with cash on delivery.</p>
                <p><span className="font-semibold text-primary">How fast does it ship?</span> Most orders dispatch in 24 to 48 hours based on stock and service area.</p>
                <p><span className="font-semibold text-primary">What if it is not the right fit?</span> The shipping notes above show replacement and support coverage for this SKU.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductSection
        eyebrow="Frequently explored together"
        title="Keep the buying momentum with related picks."
        copy="These products reinforce the same use case and help raise confidence in the basket decision."
        products={relatedProducts}
      />
    </section>
  );
}
