import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Star, TrendingUp } from "lucide-react";
import { Product } from "@/utils/types";

export function BestProductsShowcase({ products }: { products: Product[] }) {
  return (
    <section className="container-shell section-block">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="space-y-4">
          <p className="eyebrow">1L/month best products plan</p>
          <h2 className="section-title">A tighter bestseller mix built for a lean ecommerce store.</h2>
          <p className="section-copy">
            The fastest path to a first lakh per month is not catalog breadth. It is a small group of practical SKUs with visible
            savings, clear use cases, and low-friction checkout.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="surface-card p-4">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <p className="mt-3 text-sm font-semibold text-primary">Focused catalog</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">Push a shortlist of proven, repeatable winners instead of broad inventory.</p>
            </div>
            <div className="surface-card p-4">
              <BadgeCheck className="h-5 w-5 text-orange-600" />
              <p className="mt-3 text-sm font-semibold text-primary">Higher trust</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">Each product needs delivery clarity, COD visibility, and strong offer framing.</p>
            </div>
            <div className="surface-card p-4">
              <Star className="h-5 w-5 text-orange-600" />
              <p className="mt-3 text-sm font-semibold text-primary">Better conversion</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">Merchandise the SKUs most likely to convert impulse and problem-solving traffic.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {products.slice(0, 4).map((product, index) => {
            const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
            return (
              <article
                key={product.id}
                className="grid gap-4 overflow-hidden rounded-[2rem] border border-white/80 bg-white/92 p-4 shadow-sm shadow-slate-900/5 sm:grid-cols-[8.5rem_1fr] sm:p-5"
              >
                <div className="relative h-40 overflow-hidden rounded-[1.5rem] bg-[#f6ede2] sm:h-full">
                  <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, 140px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                        #{index + 1} best product
                      </span>
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                        {discount}% off
                      </span>
                      {product.badge ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          {product.badge}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-primary">{product.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{product.description}</p>
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-2xl font-semibold text-primary">Rs {product.price}</p>
                      <p className="text-sm text-slate-400 line-through">Rs {product.comparePrice}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/product/${product.slug}`} className="button-secondary px-5 py-3">
                        View product
                      </Link>
                      <Link href={`/product/${product.slug}`} className="button-primary gap-2 px-5 py-3">
                        Buy this winner
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
