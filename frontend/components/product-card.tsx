"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { Product } from "@/utils/types";
import { useState, useTransition } from "react";

export function ProductCard({ product }: { product: Product }) {
  const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  return (
    <div className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white/92 shadow-sm shadow-slate-900/5 transition-transform duration-200 hover:-translate-y-1.5">
      <Link href={`/product/${product.slug}`}>
        <div className="relative h-64 overflow-hidden bg-[#f6ede2]">
          <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
          <div className="absolute left-4 top-4 flex gap-2">
            {product.badge ? (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
                {product.badge}
              </span>
            ) : null}
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              {discount}% off
            </span>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="soft-label">{product.category}</p>
              <h3 className="mt-2 text-lg font-semibold text-primary">{product.title}</h3>
            </div>
            <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">Top rated</div>
          </div>
          <p className="text-sm leading-7 text-slate-600">{product.description}</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Star className="h-4 w-4 fill-current text-amber-400" />
            <span>{product.rating}</span>
            <span>|</span>
            <span>{product.stock} in stock</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold text-primary">Rs {product.price}</span>
            <span className="text-sm text-slate-400 line-through">Rs {product.comparePrice}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure checkout
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={() =>
            startTransition(async () => {
              try {
                await addItem(product.id, 1);
                setMessage("Added");
                setError(null);
                setTimeout(() => setMessage(null), 1800);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Could not add item");
              }
            })
          }
        >
          {isPending ? "Adding..." : message || "Quick add"}
        </button>
        <Link href={`/product/${product.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
          View details
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
      {error ? <p className="px-5 pb-4 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
