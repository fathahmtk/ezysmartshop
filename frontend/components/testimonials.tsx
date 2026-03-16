import { Testimonial } from "@/utils/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="container-shell mt-20">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Customer proof</p>
        <h2 className="section-title">Testimonials that reinforce trust before checkout.</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {testimonials.map((item) => (
          <article key={item.id} className="glass-panel p-6">
            <p className="text-lg leading-8 text-slate-700">“{item.quote}”</p>
            <div className="mt-6">
              <p className="font-semibold text-primary">{item.name}</p>
              <p className="text-sm text-slate-500">{item.location}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

