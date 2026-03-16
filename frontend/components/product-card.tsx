"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Product } from "@/utils/types";

export function ProductCard({ product }: { product: Product }) {
  const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);

  return (
    <motion.div whileHover={{ y: -6 }} className="glass-panel overflow-hidden">
      <Link href={`/product/${product.slug}`}>
        <div className="relative h-64">
          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{product.category}</p>
              <h3 className="mt-2 text-lg font-semibold text-primary">{product.title}</h3>
            </div>
            {product.badge ? (
              <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-accent">{product.badge}</span>
            ) : null}
          </div>
          <p className="text-sm text-slate-600">{product.description}</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Star className="h-4 w-4 fill-current text-amber-400" />
            <span>{product.rating}</span>
            <span>|</span>
            <span>{product.stock} in stock</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-primary">Rs {product.price}</span>
            <span className="text-sm text-slate-400 line-through">Rs {product.comparePrice}</span>
            <span className="text-sm font-semibold text-emerald-600">{discount}% off</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

