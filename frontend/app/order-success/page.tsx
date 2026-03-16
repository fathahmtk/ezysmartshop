import Link from "next/link";

export const metadata = {
  title: "Order Success"
};

export default function OrderSuccessPage() {
  return (
    <section className="container-shell py-16">
      <div className="glass-panel mx-auto max-w-2xl p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Order confirmed</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary">Your order has been placed successfully.</h1>
        <p className="mt-4 text-slate-600">A confirmation email and tracking updates will be sent automatically.</p>
        <div className="mt-8 flex justify-center gap-3">
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

