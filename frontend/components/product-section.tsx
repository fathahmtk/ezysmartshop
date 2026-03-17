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
    <section className="container-shell section-block">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{copy}</p>
        </div>
        <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:block">
          Curated for faster add-to-cart decisions
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

