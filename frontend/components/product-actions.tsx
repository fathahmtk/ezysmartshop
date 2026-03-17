"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Minus, ShieldCheck, ShoppingBag, Sparkles, Plus, Truck, Zap } from "lucide-react";
import { useCart } from "@/components/cart-provider";

type ProductActionsProps = {
  productId: string;
  title: string;
  price: number;
  comparePrice: number;
  stock: number;
};

export function ProductActions({ productId, title, price, comparePrice, stock }: ProductActionsProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const { addItem } = useCart();
  const savings = comparePrice - price;
  const lowStock = stock <= 12;

  async function handleAction(action: "cart" | "checkout") {
    try {
      await addItem(productId, quantity);
      setError(null);
      if (action === "checkout") {
        router.push("/checkout");
        return;
      }
      setMessage(`${quantity} ${quantity === 1 ? "unit" : "units"} added to cart.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-[1.75rem] border border-orange-100 bg-[#fff8ef] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary">Why shoppers convert on this product</p>
            <p className="mt-1 text-sm text-slate-600">Strong everyday utility, premium finish, and high perceived savings.</p>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            You save Rs {savings}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm shadow-slate-900/5">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isPending || quantity === 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 px-3 text-center text-sm font-semibold text-primary">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isPending || quantity >= Math.min(stock, 5)}
            onClick={() => setQuantity((current) => Math.min(Math.min(stock, 5), current + 1))}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
          Total Rs {price * quantity}
        </div>
        {lowStock ? (
          <div className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Only {stock} left in this batch
          </div>
        ) : (
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Ready to ship
          </div>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="button-primary gap-2"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await handleAction("cart");
            })
          }
        >
          <ShoppingBag className="h-4 w-4" />
          {isPending ? "Adding..." : "Add to cart"}
        </button>
        <button
          type="button"
          className="button-secondary gap-2 border-orange-200 bg-orange-50/80 text-orange-800 hover:border-orange-300 hover:text-orange-900"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await handleAction("checkout");
            })
          }
        >
          <Zap className="h-4 w-4" />
          {isPending ? "Preparing..." : "Buy now"}
        </button>
      </div>
      <div className="grid gap-3 rounded-[1.75rem] border border-slate-200 bg-[#fffaf4] p-4 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-4 w-4 text-orange-600" />
          <div>
            <p className="text-sm font-semibold text-primary">Fast dispatch</p>
            <p className="text-xs text-slate-500">Most orders ship within 24-48 hours.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-orange-600" />
          <div>
            <p className="text-sm font-semibold text-primary">Protected checkout</p>
            <p className="text-xs text-slate-500">COD and secure online payments available.</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 rounded-[1.75rem] border border-white/80 bg-white/80 p-4 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-primary">Trusted product page</p>
            <p className="text-xs text-slate-500">Visible pricing, shipping clarity, and no hidden checkout fees.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 text-orange-600" />
          <div>
            <p className="text-sm font-semibold text-primary">Popular pick</p>
            <p className="text-xs text-slate-500">{title} is frequently added with related accessories.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Heart className="mt-0.5 h-4 w-4 text-rose-500" />
          <div>
            <p className="text-sm font-semibold text-primary">Lower decision friction</p>
            <p className="text-xs text-slate-500">Replacement support and COD help first-time buyers convert.</p>
          </div>
        </div>
      </div>
      {message ? <p className="mt-3 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="container-shell flex items-center gap-3 px-0">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary">{title}</p>
            <p className="text-xs text-slate-500">Rs {price} each • Qty {quantity}</p>
          </div>
          <button
            type="button"
            className="button-primary min-w-[9.5rem] gap-2 px-5 py-3"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await handleAction("checkout");
              })
            }
          >
            <ShoppingBag className="h-4 w-4" />
            {isPending ? "..." : "Buy now"}
          </button>
        </div>
      </div>
    </div>
  );
}

