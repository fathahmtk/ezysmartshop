"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useState, useTransition } from "react";
import { useCart } from "@/components/cart-provider";
import { getBundleOffers } from "@/utils/bundle-offers";

export function CartPageClient() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addItem, cart, clearCart, isLoading, removeItem, updateItem } = useCart();

  const subtotal = cart?.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;
  const cartProductIds = cart?.items.map((item) => item.productId) || [];
  const bundleOffers = getBundleOffers(cartProductIds);

  return (
    <section className="container-shell py-10">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">Shopping cart</p>
        <h1 className="section-title">Review your order before checkout.</h1>
        <p className="section-copy">Built for fast mobile edits, visible trust signals, and a clear path to payment.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <div className="glass-panel p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              Demo customer session connected
            </span>
            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Free shipping above Rs 999
            </span>
            {cart?.items.length ? (
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                onClick={() =>
                  startTransition(async () => {
                    try {
                      await clearCart();
                      setError(null);
                      setNotice(null);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Failed to clear cart");
                    }
                  })
                }
              >
                Clear cart
              </button>
            ) : null}
          </div>
          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          {notice ? <p className="mt-4 text-sm text-emerald-600">{notice}</p> : null}
          {(isPending || isLoading) && !cart ? <p className="mt-4 text-sm text-slate-500">Loading cart...</p> : null}
          <div className="mt-6 space-y-4">
            {cart?.items.length ? (
              cart.items.map((item) => (
                <div key={item.id} className="surface-card p-4 md:p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="soft-label">{item.product?.category || "Product"}</p>
                      <p className="mt-2 font-semibold text-primary">{item.product?.title || "Unavailable product"}</p>
                      <p className="mt-1 text-sm text-slate-500">Rs {item.product?.price || 0} each</p>
                    </div>
                    <p className="text-lg font-semibold text-primary">Rs {(item.product?.price || 0) * item.quantity}</p>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(event) =>
                        startTransition(async () => {
                          try {
                            await updateItem(item.id, Number(event.target.value));
                            setError(null);
                            setNotice(null);
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to update cart");
                          }
                        })
                      }
                      className="w-28 rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      className="text-sm font-semibold text-rose-600"
                      onClick={() =>
                        startTransition(async () => {
                          try {
                            await removeItem(item.id);
                            setError(null);
                            setNotice(null);
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
          {cart?.items.length ? (
            <div className="mt-8 rounded-[1.9rem] border border-orange-100 bg-[#fff8ef] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Bundle offers</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">Raise AOV with one more useful product.</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    These add-ons are chosen to feel like natural companions, not random cross-sells.
                  </p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Low-friction upsells
                </div>
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-3">
                {bundleOffers.map((offer) => (
                  <article key={offer.product.id} className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 shadow-sm shadow-slate-900/5">
                    <div className="relative h-44 bg-[#f6ede2]">
                      <Image src={offer.product.images[0]} alt={offer.product.title} fill sizes="(max-width: 1280px) 100vw, 320px" className="object-cover" />
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                          {offer.tag}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          Rs {offer.product.price}
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-primary">{offer.product.title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{offer.reason}</p>
                      </div>
                      <button
                        type="button"
                        className="button-secondary w-full gap-2"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            try {
                              await addItem(offer.product.id, 1);
                              setError(null);
                              setNotice(`${offer.product.title} added as a bundle offer.`);
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Failed to add bundle product");
                            }
                          })
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Add bundle item
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <aside className="glass-panel h-fit p-6 lg:sticky lg:top-28">
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
          <div className="mt-6 space-y-3 rounded-[1.5rem] bg-[#fff7ed] p-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-orange-600" />
              <span>Expected delivery in 3-5 business days.</span>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-orange-600" />
              <span>Secure online payments and Cash on Delivery available.</span>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-orange-600" />
              <span>Bundle suggestions are shown here to lift order value without slowing the path to checkout.</span>
            </div>
          </div>
          <Link href="/checkout" className="button-primary mt-6 w-full">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}

