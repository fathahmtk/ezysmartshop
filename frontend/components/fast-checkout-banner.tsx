import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

const steps = [
  {
    icon: ShoppingBag,
    title: "Pick a proven SKU",
    copy: "Use a tighter product set with stronger offer framing and quick product entry points."
  },
  {
    icon: CreditCard,
    title: "Move to checkout fast",
    copy: "Reduce friction with COD support, visible totals, and fewer questions between cart and payment."
  },
  {
    icon: Truck,
    title: "Reassure before payment",
    copy: "Repeat delivery and replacement messages close to the CTA so users do not abandon late."
  }
];

export function FastCheckoutBanner() {
  return (
    <section className="container-shell section-block pb-8">
      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/80 bg-primary px-6 py-7 text-white shadow-2xl shadow-slate-900/10 md:px-10 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_24%),radial-gradient(circle_at_85%_20%,rgba(251,146,60,0.18),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-200">Fast checkout</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Shorten the path from product page to paid order.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
              For a 1 lakh per month store, speed matters more than complexity. Keep checkout obvious, trusted, and one decision at a time.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="button-primary gap-2 bg-white text-primary hover:bg-orange-50">
                Shop top products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/checkout" className="button-secondary border-white/30 bg-white/10 text-white hover:border-white hover:text-white">
                Open checkout
              </Link>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">
              <ShieldCheck className="h-4 w-4" />
              Clear totals, COD support, secure payment flow
            </div>
          </div>
          <div className="grid gap-4">
            {steps.map((step) => (
              <article key={step.title} className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-orange-200">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{step.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-200">{step.copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
