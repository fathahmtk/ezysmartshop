"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ValuePromise() {
  const metrics = [
    { label: "Avg basket", value: "₹2,100" },
    { label: "Conversion lift", value: "+24%" },
    { label: "Repeat shoppers", value: "62%" }
  ];
  const promises = [
    "Real product photos + verified specs above the fold",
    "Clear shipping + COD promises reduce friction",
    "One-click checkout flow with visible trust strips"
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const metricVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="container-shell section-block">
      <motion.div
        ref={ref}
        className="section-shell grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.2 }}
      >
        <div>
          <p className="eyebrow">Value promise</p>
          <h2 className="section-title">Every interaction pushes toward purchase.</h2>
          <p className="section-copy">
            The storefront is tuned like a daily shopping destination—stable hero, clear metrics, relevant categories, and trust cues that keep the cart,
            checkout, and payment journeys consistent.
          </p>
          <div className="mt-5 space-y-2 text-sm text-slate-600">
            {promises.map((item) => (
              <motion.p key={item} className="flex items-start gap-2" variants={metricVariant}>
                <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-orange-500" />
                {item}
              </motion.p>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <motion.article key={metric.label} className="metric-card" variants={metricVariant}>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{metric.label}</p>
              <p className="text-2xl font-semibold text-primary">{metric.value}</p>
              <p className="text-xs text-slate-400">Projected</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
