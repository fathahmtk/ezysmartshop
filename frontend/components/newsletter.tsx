export function Newsletter() {
  return (
    <section className="container-shell section-block pb-8">
      <div className="overflow-hidden rounded-[2rem] bg-primary px-6 py-8 text-white md:grid md:grid-cols-[1fr_auto] md:items-center md:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">Email subscription</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Get launch drops, flash deals, and restock alerts.</h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-200">Retention-focused capture for repeat orders, new arrivals, and coupon recovery campaigns.</p>
        </div>
        <form className="flex flex-col gap-3 md:min-w-[360px] md:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-slate-300"
          />
          <button type="submit" className="button-primary whitespace-nowrap bg-white text-primary hover:bg-orange-50">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

