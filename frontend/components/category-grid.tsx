import Link from "next/link";
import { Category } from "@/utils/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="container-shell mt-20">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Shop by category</p>
        <h2 className="section-title">Focused collections for high-intent discovery.</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/shop?category=${category.slug}`} className="glass-panel p-6 transition hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Collection</p>
            <p className="mt-3 text-2xl font-semibold text-primary">{category.name}</p>
            <p className="mt-2 text-sm text-slate-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

