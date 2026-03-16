"use client";

import { useState, useTransition } from "react";
import { addCartItem } from "@/utils/client-api";

export function ProductActions({ productId }: { productId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="button-primary"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              try {
                await addCartItem(productId, 1);
                setMessage("Added to cart.");
                setError(null);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to add to cart");
              }
            })
          }
        >
          {isPending ? "Adding..." : "Add to cart"}
        </button>
        <button type="button" className="button-secondary">
          Add to wishlist
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

