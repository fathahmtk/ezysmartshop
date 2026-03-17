"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { fetchOrder } from "@/utils/client-api";
import { OrderRecord } from "@/utils/types";

export function OrderSuccessClient({ orderId }: { orderId?: string }) {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!orderId) return;

    startTransition(async () => {
      try {
        setOrder(await fetchOrder(orderId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      }
    });
  }, [orderId]);

  return (
    <section className="container-shell py-16">
      <div className="glass-panel mx-auto max-w-3xl p-8 md:p-10">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary">Your order has been placed successfully.</h1>
        <p className="mt-4 text-slate-600">Confirmation and delivery updates will appear in your account order history.</p>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        {isPending && orderId ? <p className="mt-4 text-sm text-slate-500">Loading order details...</p> : null}
        {order ? (
          <div className="mt-8 grid gap-4 rounded-[1.75rem] bg-[#fff7ed] p-5 md:grid-cols-3">
            <div>
              <p className="soft-label">Reference</p>
              <p className="mt-2 font-semibold text-primary">{order.id}</p>
            </div>
            <div>
              <p className="soft-label">Payment</p>
              <p className="mt-2 font-semibold capitalize text-primary">{order.paymentStatus}</p>
            </div>
            <div>
              <p className="soft-label">Total</p>
              <p className="mt-2 font-semibold text-primary">Rs {order.total}</p>
            </div>
          </div>
        ) : orderId ? (
          <p className="mt-4 text-sm font-semibold text-primary">Reference: {orderId}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/account" className="button-primary">
            Track order
          </Link>
          <Link href="/shop" className="button-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
