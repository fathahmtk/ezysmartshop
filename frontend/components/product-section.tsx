import { Product } from "@/utils/types";
import { ProductCard } from "@/components/product-card";

export function ProductSection({
  eyebrow,
  title,
  copy,
  products
}: {
  eyebrow: string;
  title: string;
  copy: string;
  products: Product[];
}) {
  return (
    <section className="container-shell mt-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{copy}</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

