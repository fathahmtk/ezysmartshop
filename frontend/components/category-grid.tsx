import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/utils/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="container-shell section-block">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">Shop by category</p>
        <h2 className="section-title">Focused collections for fast, high-intent discovery.</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <p className="soft-label">Collection</p>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                Browse
              </span>
            </div>
            <p className="text-2xl font-semibold text-primary">{category.name}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
              Open collection
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

