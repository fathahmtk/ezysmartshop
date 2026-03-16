"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchOrders, getDemoCredentials } from "@/utils/client-api";
import { OrderRecord } from "@/utils/types";

export function AccountPageClient() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const credentials = getDemoCredentials();

  useEffect(() => {
    startTransition(async () => {
      try {
        setOrders(await fetchOrders());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      }
    });
  }, []);

  return (
    <section className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[0.32fr_1fr]">
        <aside className="glass-panel p-6">
          <p className="text-xl font-semibold text-primary">Demo customer account</p>
          <p className="mt-2 text-sm text-slate-600">Preview login is wired automatically for QA and storefront testing.</p>
          <div className="mt-6 space-y-2 text-sm text-slate-600">
            <p>Email: {credentials.email}</p>
            <p>Password: {credentials.password}</p>
            <p>Wishlist</p>
            <p>Saved addresses</p>
          </div>
        </aside>
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h1 className="text-3xl font-semibold tracking-tight text-primary">My orders</h1>
            {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
            {isPending && !orders.length ? <p className="mt-4 text-sm text-slate-500">Loading orders...</p> : null}
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-slate-100 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-primary">{order.id}</p>
                      <p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">Rs {order.total}</p>
                      <p className="mt-1 text-sm text-accent">{order.orderStatus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

