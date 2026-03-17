import { BadgeCheck, CreditCard, MessageSquareMore, ShieldCheck, Truck, Undo2 } from "lucide-react";

const trustBlocks = [
  {
    icon: ShieldCheck,
    title: "Secure payment visibility",
    copy: "Razorpay, Stripe, and COD are surfaced early so visitors do not need to guess how they can pay."
  },
  {
    icon: Truck,
    title: "Dispatch promise",
    copy: "Core SKUs are framed around 24 to 48 hour dispatch so the offer feels tangible, not vague."
  },
  {
    icon: Undo2,
    title: "Replacement confidence",
    copy: "Clear replacement and support messaging reduces hesitation for first-time buyers."
  },
  {
    icon: MessageSquareMore,
    title: "Buyer reassurance",
    copy: "Use concise support, shipping, and policy copy above the fold instead of burying it deep in the footer."
  }
];

const policyBadges = [
  "Free shipping above Rs 999",
  "Cash on Delivery available",
  "7-day replacement",
  "Secure checkout"
];

export function TrustElements() {
  return (
    <section className="container-shell section-block">
      <div className="glass-panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="eyebrow">Trust elements</p>
            <h2 className="section-title">The store needs to feel credible before it feels exciting.</h2>
            <p className="section-copy">
              For a lean ecommerce setup, trust does more revenue work than visual polish. Buyers need clear policies, clear pricing, and
              a visible payment path before they commit.
            </p>
            <div className="flex flex-wrap gap-3">
              {policyBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustBlocks.map((item) => (
              <article key={item.title} className="rounded-[1.75rem] border border-white/80 bg-white/85 p-5 shadow-sm shadow-slate-900/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1e7] text-orange-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-lg font-semibold tracking-tight text-primary">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-slate-200/70 bg-[#fff8ef] p-5 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-primary">Payment confidence</p>
              <p className="mt-1 text-xs leading-6 text-slate-600">Online payments and COD appear as store-wide trust anchors, not hidden options.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-primary">Delivery clarity</p>
              <p className="mt-1 text-xs leading-6 text-slate-600">Shipping speed and dispatch expectations are repeated across home, PDP, cart, and checkout.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-primary">Practical merchandising</p>
              <p className="mt-1 text-xs leading-6 text-slate-600">Lead with products that solve daily friction and justify impulse purchases quickly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
