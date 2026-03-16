import Link from "next/link";

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
    <section className="container-shell mt-20">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Why it converts</p>
        <h2 className="section-title">Merchandising blocks built for gadget-store conversion.</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="glass-panel p-6">
            <p className="text-2xl font-semibold tracking-tight text-primary">{item.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            <Link href={item.href} className="mt-5 inline-flex text-sm font-semibold text-accent">
              Open section
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

