"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { fetchCart, removeCartItem, updateCartItem } from "@/utils/client-api";
import { CartState } from "@/utils/types";

export function CartPageClient() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        setCart(await fetchCart());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cart");
      }
    });
  }, []);

  const subtotal = cart?.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;

  return (
    <section className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <div className="glass-panel p-6">
          <h1 className="text-3xl font-semibold tracking-tight text-primary">Shopping cart</h1>
          <p className="mt-2 text-sm text-slate-600">Demo customer session is preconnected for preview and QA.</p>
          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          {isPending && !cart ? <p className="mt-4 text-sm text-slate-500">Loading cart...</p> : null}
          <div className="mt-6 space-y-4">
            {cart?.items.length ? (
              cart.items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-primary">{item.product?.title || "Unavailable product"}</p>
                      <p className="mt-1 text-sm text-slate-500">Rs {item.product?.price || 0} each</p>
                    </div>
                    <p className="font-semibold text-primary">Rs {(item.product?.price || 0) * item.quantity}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(event) =>
                        startTransition(async () => {
                          try {
                            setCart(await updateCartItem(item.id, Number(event.target.value)));
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to update cart");
                          }
                        })
                      }
                      className="w-24 rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      className="text-sm font-semibold text-rose-600"
                      onClick={() =>
                        startTransition(async () => {
                          try {
                            setCart(await removeCartItem(item.id));
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to remove item");
                          }
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              !isPending && <p className="text-sm text-slate-500">Your cart is empty.</p>
            )}
          </div>
        </div>
        <aside className="glass-panel h-fit p-6">
          <h2 className="text-xl font-semibold text-primary">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between border-t border-slate-200 pt-4 font-semibold text-primary">
            <span>Total</span>
            <span>Rs {subtotal}</span>
          </div>
          <Link href="/checkout" className="button-primary mt-6 w-full">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}

