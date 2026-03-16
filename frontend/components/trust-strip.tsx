const items = [
  "Cash on Delivery",
  "Razorpay & Stripe",
  "Fast shipping across India",
  "Verified gadget catalog"
];

export function TrustStrip() {
  return (
    <section className="container-shell mt-10">
      <div className="glass-panel grid gap-4 px-6 py-5 text-sm font-medium text-slate-600 md:grid-cols-4">
        {items.map((item) => (
          <div key={item} className="rounded-full border border-slate-100 bg-white px-4 py-3 text-center">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

