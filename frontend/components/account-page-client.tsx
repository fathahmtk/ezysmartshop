"use client";

import { useEffect, useState, useTransition } from "react";
import { cancelOrder, fetchOrders, getDemoCredentials } from "@/utils/client-api";
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
          <p className="text-xl font-semibold text-primary">{credentials ? "Demo customer account" : "Customer account"}</p>
          <p className="mt-2 text-sm text-slate-600">
            {credentials
              ? "Preview login is wired automatically for QA and storefront testing."
              : "Demo mode is disabled in this deployment. Connect real customer authentication before production use."}
          </p>
          <div className="mt-6 space-y-2 text-sm text-slate-600">
            {credentials ? <p>Email: {credentials.email}</p> : null}
            {credentials ? <p>Password: {credentials.password}</p> : null}
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
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-primary">{order.id}</p>
                      <p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="mt-2 text-sm text-slate-500">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">Rs {order.total}</p>
                      <p className="mt-1 text-sm capitalize text-orange-700">{order.orderStatus}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{order.paymentMethod || "payment"} / {order.paymentStatus}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-[#faf6ef] p-4 text-sm text-slate-600">
                    <p className="font-semibold text-primary">Shipping address</p>
                    <p className="mt-2">{order.shippingAddress}</p>
                    <p className="mt-3 font-semibold text-primary">Items</p>
                    <div className="mt-2 space-y-1">
                      {order.items.map((item) => (
                        <p key={item.id}>
                          {item.quantity} x {item.productId} at Rs {item.price}
                        </p>
                      ))}
                    </div>
                  </div>
                  {order.orderStatus === "created" ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() =>
                          startTransition(async () => {
                            try {
                              const updated = await cancelOrder(order.id);
                              setOrders((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
                              setError(null);
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Failed to cancel order");
                            }
                          })
                        }
                      >
                        Cancel order
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

