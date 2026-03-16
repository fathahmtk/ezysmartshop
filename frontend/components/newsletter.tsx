export function Newsletter() {
  return (
    <section className="container-shell mt-20 pb-8">
      <div className="glass-panel grid gap-6 px-6 py-8 md:grid-cols-[1fr_auto] md:items-center md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Email subscription</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary">Get launch drops, flash deals, and restock alerts.</h2>
          <p className="mt-2 text-sm text-slate-600">Built for retention and repeat purchase flows.</p>
        </div>
        <form className="flex flex-col gap-3 md:min-w-[360px] md:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none ring-accent transition focus:ring-2"
          />
          <button type="submit" className="button-primary whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

