import { BadgeCheck, CreditCard, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Truck, label: "Fast shipping", copy: "Dispatch across India" },
  { icon: CreditCard, label: "Flexible payment", copy: "COD, Razorpay, Stripe" },
  { icon: ShieldCheck, label: "Secure checkout", copy: "Trust-first payment flow" },
  { icon: BadgeCheck, label: "Verified catalog", copy: "Curated practical gadgets" }
];

export function TrustStrip() {
  return (
    <section className="container-shell mt-8">
      <div className="grid gap-3 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="surface-card flex items-center gap-3 px-4 py-4">
            <div className="rounded-full bg-orange-50 p-2 text-orange-700">
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{item.label}</p>
              <p className="text-xs text-slate-500">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

