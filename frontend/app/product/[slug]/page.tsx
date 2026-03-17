import Script from "next/script";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Truck } from "lucide-react";
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
    <section className="container-shell py-10">
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="glass-panel relative h-[440px] overflow-hidden">
          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
        </div>
        <div className="glass-panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">{product.category}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Star className="h-4 w-4 fill-current text-amber-400" />
            <span>{product.rating}</span>
            <span>|</span>
            <span>{product.stock} units available</span>
          </div>
          <p className="mt-6 text-base leading-7 text-slate-600">{product.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-semibold text-primary">Rs {product.price}</span>
            <span className="text-lg text-slate-400 line-through">Rs {product.comparePrice}</span>
          </div>
          <ProductActions productId={product.id} />
          <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="font-semibold text-primary">Specifications</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {product.specifications.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-5">
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
      </div>
      <ProductSection
        eyebrow="Related products"
        title="Customers also considered these items."
        copy="This section can be driven by AI recommendations or merchandising rules."
        products={products.filter((item) => item.id !== product.id).slice(0, 3)}
      />
    </section>
  );
}
