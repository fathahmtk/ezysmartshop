"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { createOrder, createPaymentIntent, fetchCart, fetchQuote } from "@/utils/client-api";
import { CartState, CheckoutQuote } from "@/utils/types";

const initialAddress = {
  fullName: "Priya Sharma",
  phone: "9876543210",
  addressLine: "HSR Layout",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560102"
};

export function CheckoutPageClient() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "stripe" | "cod">("razorpay");
  const [address, setAddress] = useState(initialAddress);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const items = useMemo(
    () => cart?.items.map((item) => ({ productId: item.productId, quantity: item.quantity })) || [],
    [cart]
  );

  useEffect(() => {
    startTransition(async () => {
      try {
        const nextCart = await fetchCart();
        setCart(nextCart);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load checkout");
      }
    });
  }, []);

  useEffect(() => {
    if (!items.length) {
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
        const shippingAddress = `${address.fullName}, ${address.phone}, ${address.addressLine}, ${address.city}, ${address.state} ${address.pincode}`;
        const order = await createOrder({
          shippingAddress,
          paymentMethod,
          couponCode: couponCode || undefined,
          items
        });
        setCart({ id: "cart-empty", userId: "usr-customer", items: [] });
        setQuote(null);
        setMessage(`Order ${order.id} created. Payment provider: ${payment.provider}. Amount: Rs ${payment.amount}.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to place order");
      }
    });
  }

  return (
    <section className="container-shell py-10">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Checkout flow</p>
        <h1 className="section-title">Address, shipping, payment, confirmation.</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <form className="glass-panel space-y-6 p-6" onSubmit={handleSubmit}>
          <div>
            <p className="text-lg font-semibold text-primary">Shipping address</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {Object.entries(address).map(([key, value]) => (
                <input
                  key={key}
                  value={value}
                  onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                  className={`rounded-2xl border border-slate-200 px-4 py-3 text-sm ${key === "addressLine" ? "md:col-span-2" : ""}`}
                  placeholder={key}
                />
              ))}
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2"
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
                <label key={value} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm">
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
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          <button type="submit" className="button-primary" disabled={isPending || !items.length}>
            {isPending ? "Processing..." : "Confirm order"}
          </button>
        </form>
        <aside className="glass-panel h-fit p-6">
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
          <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">Expected delivery: 3-5 business days</div>
        </aside>
      </div>
    </section>
  );
}

