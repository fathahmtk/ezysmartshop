"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

const heroNav = [
  { href: "/shop?sort=popularity", label: "Trending packs" },
  { href: "/shop?category=workspace", label: "Workspace combos" },
  { href: "/shop?category=smart-home", label: "Home essentials" },
  { href: "/shop?category=wellness-style", label: "Wellness & style" }
];

export function HeroBanner() {
  return (
    <section className="container-shell pt-6 md:pt-10">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-primary px-5 py-6 text-white shadow-2xl shadow-slate-900/10 md:px-10 md:py-10 lg:px-12 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_26%),radial-gradient(circle_at_85%_20%,rgba(251,146,60,0.2),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />
        <div className="relative space-y-6">
          <nav className="flex flex-wrap gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-white/70">
            {heroNav.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full border border-white/30 px-3 py-1 transition hover:border-white hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
                <Sparkles className="h-4 w-4" />
                Smart gadgets that solve daily friction
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  Everyday utility products built to convert on mobile.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-lg">
                  Shop home, workspace, and car essentials with fast dispatch, clear pricing, and trust-first checkout flows.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="button-primary gap-2 bg-white text-primary hover:bg-orange-50">
                  Shop best sellers
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/checkout" className="button-secondary border-white/30 bg-white/10 text-white hover:border-white hover:text-white">
                  Quick checkout
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Avg delivery</p>
                  <p className="mt-2 text-lg font-semibold">3-5 days</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Top offer</p>
                  <p className="mt-2 text-lg font-semibold">WELCOME10</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Payment mix</p>
                  <p className="mt-2 text-lg font-semibold">COD + online</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid gap-4">
                <div className="surface-card overflow-hidden p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">Flash deals</p>
                      <p className="mt-3 text-3xl font-semibold text-primary">Up to 38% off</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        Charging stations, night lights, and desk accessories promoted with urgency.
                      </p>
                    </div>
                    <div className="rounded-full bg-orange-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                      Limited drop
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-[#f7f1e8] p-4">
                      <p className="soft-label">AOV booster</p>
                      <p className="mt-2 text-lg font-semibold text-primary">Bundle-ready pairing</p>
                      <p className="mt-1 text-sm text-slate-600">Promote charging, lighting, and creator kits together.</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-[#fff3e6] p-4">
                      <p className="soft-label">Trust signal</p>
                      <p className="mt-2 text-lg font-semibold text-primary">Secure checkout</p>
                      <p className="mt-1 text-sm text-slate-600">Razorpay, Stripe, and COD are all surfaced clearly.</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="surface-card flex items-start gap-3 p-4">
                    <Truck className="mt-0.5 h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-primary">Fast delivery promise</p>
                      <p className="mt-1 text-sm text-slate-600">Average dispatch within 24-48 hours for core SKUs.</p>
                    </div>
                  </div>
                  <div className="surface-card flex items-start gap-3 p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-primary">Checkout confidence</p>
                      <p className="mt-1 text-sm text-slate-600">COD support and visible payment providers reduce hesitation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
