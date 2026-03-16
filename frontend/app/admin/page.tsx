const stats = [
  { label: "Revenue", value: "Rs 4.82L" },
  { label: "Orders", value: "1,248" },
  { label: "Conversion", value: "4.9%" },
  { label: "AOV", value: "Rs 1,940" }
];

const topProducts = [
  "3-in-1 Wireless Charging Station",
  "RGB LED Light Strip",
  "Portable Car Vacuum Cleaner"
];

export const metadata = {
  title: "Admin Dashboard"
};

export default function AdminPage() {
  return (
    <section className="container-shell py-10">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Admin dashboard</p>
        <h1 className="section-title">Operations, analytics, catalog, and order control.</h1>
        <p className="section-copy">This surface is designed to connect to protected backend admin endpoints.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="glass-panel p-6">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-primary">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold text-primary">Management modules</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {["Products", "Inventory", "Orders", "Customers", "Coupons", "Analytics"].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-100 p-5">
                <p className="font-semibold text-primary">{item}</p>
                <p className="mt-2 text-sm text-slate-600">Connected through REST endpoints and role-based access control.</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="glass-panel p-6">
          <h2 className="text-xl font-semibold text-primary">Top products</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            {topProducts.map((product) => (
              <div key={product} className="rounded-2xl border border-slate-100 p-4">
                {product}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

