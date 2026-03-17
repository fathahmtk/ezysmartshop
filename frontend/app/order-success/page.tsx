import Link from "next/link";

export const metadata = {
  title: "Order Success"
};

type OrderSuccessSearchParams = {
  orderId?: string;
};

type OrderSuccessPageProps = {
  searchParams?: OrderSuccessSearchParams | Promise<OrderSuccessSearchParams>;
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);

  return (
    <section className="container-shell py-16">
      <div className="glass-panel mx-auto max-w-2xl p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Order confirmed</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary">Your order has been placed successfully.</h1>
        <p className="mt-4 text-slate-600">A confirmation email and tracking updates will be sent automatically.</p>
        {resolvedSearchParams?.orderId ? (
          <p className="mt-4 text-sm font-semibold text-primary">Reference: {resolvedSearchParams.orderId}</p>
        ) : null}
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
