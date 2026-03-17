import Link from "next/link";
import { ArrowRight } from "lucide-react";

const highlights = [
  {
    title: "Problem-solving gadgets",
    copy: "Curated SKUs that remove friction from bedrooms, desks, and car interiors.",
    href: "/shop?sort=popularity"
  },
  {
    title: "Fast-moving bundles",
    copy: "Promote high-intent pairings like charging stations plus ring lights or lights plus mounts.",
    href: "/shop?category=workspace"
  },
  {
    title: "Retention-ready offers",
    copy: "Coupons, AI recommendations, and email capture blocks are already wired into the flow.",
    href: "/checkout"
  }
];

export function FeatureSpotlight() {
  return (
    <section className="container-shell section-block">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">Why it converts</p>
        <h2 className="section-title">Merchandising blocks built for gadget-store conversion.</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="surface-card p-6">
            <p className="text-2xl font-semibold tracking-tight text-primary">{item.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            <Link href={item.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
              Open section
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

