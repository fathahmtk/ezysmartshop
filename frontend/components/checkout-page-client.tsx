"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { CreditCard, Plus, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { createOrder, createPaymentIntent, fetchQuote } from "@/utils/client-api";
import { useCart } from "@/components/cart-provider";
import { CheckoutQuote } from "@/utils/types";
import { getBundleOffers } from "@/utils/bundle-offers";
import { isShopifyConfigured } from "@/utils/shopify";

const shopifyMode = isShopifyConfigured();

const initialAddress = {
  fullName: "Priya Sharma",
  phone: "9876543210",
  addressLine: "HSR Layout",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560102"
};

export function CheckoutPageClient() {
  const router = useRouter();
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "stripe" | "cod">("razorpay");
  const [address, setAddress] = useState(initialAddress);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addItem, cart, refreshCart } = useCart();

  // When Shopify is configured, checkout is handled by Shopify's native checkout.
  // Redirect as soon as the checkout URL is available.
  useEffect(() => {
    if (shopifyMode && cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart?.checkoutUrl]);

  const items = useMemo(
    () => cart?.items.map((item) => ({ productId: item.productId, quantity: item.quantity })) || [],
    [cart]
  );
  const orderBump = !shopifyMode ? (getBundleOffers(items.map((item) => item.productId))[0] || null) : null;

  useEffect(() => {
    if (shopifyMode || !items.length) {
      setQuote(null);
      return;
    }

    startTransition(async () => {
      try {
        setQuote(await fetchQuote(items, couponCode || undefined));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to quote order");
      }
    });
  }, [items, couponCode]);


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        if (!items.length) throw new Error("Your cart is empty");
        const payment = await createPaymentIntent(paymentMethod, items, couponCode || undefined);
        if (paymentMethod !== "cod" && payment.configured === false) {
          throw new Error(`${payment.provider} is not configured in this environment`);
        }
        const shippingAddress = `${address.fullName}, ${address.phone}, ${address.addressLine}, ${address.city}, ${address.state} ${address.pincode}`;
        const order = await createOrder({
          shippingAddress,
          paymentMethod,
          couponCode: couponCode || undefined,
          items
        });
        await refreshCart();
        setQuote(null);
        setMessage(`Order ${order.id} created. Payment provider: ${payment.provider}. Amount: Rs ${payment.amount}.`);
        router.push(`/order-success?orderId=${order.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to place order");
      }
    });
  }

  return (
    <section className="container-shell py-10">
      {shopifyMode ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <p className="text-lg font-semibold text-primary">Redirecting to Shopify checkout…</p>
          {cart?.checkoutUrl ? (
            <a href={cart.checkoutUrl} className="button-primary">
              Click here if not redirected automatically
            </a>
          ) : (
            <p className="text-sm text-slate-500">Preparing your cart, please wait.</p>
          )}
        </div>
      ) : (
        <>
      <div className="mb-8 space-y-3">
        <p className="eyebrow">Checkout flow</p>
        <h1 className="section-title">Address, shipping, payment, confirmation.</h1>
        <p className="section-copy">The checkout surface is optimized for low-friction mobile completion and visible trust reassurance.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <form className="glass-panel space-y-6 p-5 md:p-6" onSubmit={handleSubmit}>
          <div>
            <p className="text-lg font-semibold text-primary">Shipping address</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {Object.entries(address).map(([key, value]) => (
                <input
                  key={key}
                  value={value}
                  onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                  className={`field-input ${key === "addressLine" ? "md:col-span-2" : ""}`}
                  placeholder={key}
                />
              ))}
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                className="field-input md:col-span-2"
                placeholder="Coupon code"
              />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-primary">Payment method</p>
            <div className="mt-4 grid gap-3">
              {[
                ["razorpay", "Razorpay"],
                ["stripe", "Stripe"],
                ["cod", "Cash on Delivery"]
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value as "razorpay" | "stripe" | "cod")}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-3 rounded-[1.75rem] bg-[#fff7ed] p-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-orange-600" />
              <span className="text-sm text-slate-700">Fast dispatch for core SKUs</span>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-orange-600" />
              <span className="text-sm text-slate-700">Protected payment flow</span>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-4 w-4 text-orange-600" />
              <span className="text-sm text-slate-700">COD and online payments</span>
            </div>
          </div>
          {orderBump ? (
            <div className="overflow-hidden rounded-[1.9rem] border border-orange-100 bg-[#fff8ef]">
              <div className="grid gap-4 md:grid-cols-[8.5rem_1fr]">
                <div className="relative h-40 bg-[#f6ede2] md:h-full">
                  <Image src={orderBump.product.images[0]} alt={orderBump.product.title} fill sizes="(max-width: 768px) 100vw, 136px" className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                      Checkout order bump
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                      {orderBump.tag}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-primary">{orderBump.product.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{orderBump.reason}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-primary">Add for Rs {orderBump.product.price}</p>
                      <p className="text-sm text-slate-400 line-through">Rs {orderBump.product.comparePrice}</p>
                    </div>
                    <button
                      type="button"
                      className="button-secondary gap-2 px-5 py-3"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          try {
                            await addItem(orderBump.product.id, 1);
                            await refreshCart();
                            setMessage(`${orderBump.product.title} added to this checkout.`);
                            setError(null);
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to add order bump");
                          }
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add to order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          <button type="submit" className="button-primary" disabled={isPending || !items.length}>
            {isPending ? "Processing..." : "Confirm order"}
          </button>
        </form>
        <aside className="glass-panel h-fit p-6 lg:sticky lg:top-28">
          <p className="text-lg font-semibold text-primary">Summary</p>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{quote ? `Rs ${quote.subtotal}` : "--"}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{quote ? `-Rs ${quote.discount}` : "--"}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span>{quote ? `Rs ${quote.total}` : "--"}</span>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-[#f8f2e8] p-4 text-sm text-slate-600">
            <p className="font-semibold text-primary">Expected delivery</p>
            <p className="mt-2">3-5 business days</p>
            <p className="mt-3 font-semibold text-primary">Why customers complete this checkout</p>
            <p className="mt-2">Clear totals, secure payment visibility, and COD support above the fold.</p>
            <p className="mt-3 font-semibold text-primary">AOV booster</p>
            <p className="mt-2">A single relevant order bump increases basket size without forcing shoppers back into browsing.</p>
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-white/80 bg-white/80 p-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-orange-600" />
              <span>Keep checkout short: useful add-ons, visible total, and one clear payment decision.</span>
            </div>
          </div>
        </aside>
      </div>
        </>
      )}
    </section>
  );
}
