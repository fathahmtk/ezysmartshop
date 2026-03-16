"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroBanner() {
  return (
    <section className="container-shell pt-10 md:pt-16">
      <div className="glass-panel relative overflow-hidden px-6 py-10 md:px-12 md:py-16">
        <div className="absolute inset-0 bg-grid bg-[size:24px_24px] opacity-30" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Smart gadgets that solve daily friction
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-primary md:text-6xl">
                Premium utility products for Indian homes, desks, and cars.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Discover curated gadgets with clean design, reliable delivery, secure checkout, and conversion-ready offers.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="button-primary">
                Shop best sellers
              </Link>
              <Link href="/checkout" className="button-secondary">
                Quick checkout
              </Link>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-100 bg-white/80 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Avg delivery</p>
                <p className="mt-2 text-lg font-semibold text-primary">3-5 days</p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white/80 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Top offer</p>
                <p className="mt-2 text-lg font-semibold text-primary">WELCOME10</p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white/80 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Payment mix</p>
                <p className="mt-2 text-lg font-semibold text-primary">COD + online</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative"
          >
            <div className="glass-panel grid gap-4 p-5">
              <div className="rounded-[2rem] bg-primary p-5 text-white">
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">Flash deals</p>
                <p className="mt-3 text-3xl font-semibold">Up to 38% off</p>
                <p className="mt-2 text-sm text-slate-200">On lighting, charging stations, and home essentials.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Trust badge</p>
                  <p className="mt-2 text-lg font-semibold text-primary">Secure checkout</p>
                  <p className="mt-1 text-sm text-slate-600">Razorpay, Stripe, and COD supported.</p>
                </div>
                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Made to convert</p>
                  <p className="mt-2 text-lg font-semibold text-primary">Bundle-ready merchandising</p>
                  <p className="mt-1 text-sm text-slate-600">Curated upsells and AI recommendations.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
