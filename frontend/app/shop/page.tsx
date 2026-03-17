import { getProducts } from "@/utils/api";
import { ProductCard } from "@/components/product-card";

export const metadata = {
  title: "Shop"
};

type ShopSearchParams = {
  q?: string;
  category?: string;
  sort?: string;
};

type ShopPageProps = {
  searchParams?: Promise<ShopSearchParams>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const products = await getProducts();
  const q = resolvedSearchParams?.q?.toLowerCase() || "";
  const category = resolvedSearchParams?.category || "";
  const sort = resolvedSearchParams?.sort || "popularity";
  const filtered = products
    .filter((product) => {
      const matchesQuery = q
        ? [product.title, product.description, product.category].some((value) => value.toLowerCase().includes(q))
        : true;
      const matchesCategory = category ? product.category.toLowerCase().replace(/\s+/g, "-") === category : true;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return b.id.localeCompare(a.id);
      return b.rating - a.rating;
    });

  return (
    <section className="container-shell py-10">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Shop all products</p>
        <h1 className="section-title">Search, compare, and discover smart gadgets.</h1>
        <p className="section-copy">
          This page is structured for server-rendered filtering, category discovery, and future autocomplete integration.
        </p>
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2">{filtered.length} products</span>
        {category ? <span className="rounded-full border border-slate-200 bg-white px-4 py-2">Category: {category}</span> : null}
        {q ? <span className="rounded-full border border-slate-200 bg-white px-4 py-2">Search: {q}</span> : null}
      </div>
      <form className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-4">
        <input
          name="q"
          defaultValue={resolvedSearchParams?.q || ""}
          className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none"
          placeholder="Search products"
        />
        <select name="category" defaultValue={category} className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none">
          <option value="">All categories</option>
          <option value="smart-home">Smart Home</option>
          <option value="car-essentials">Car Essentials</option>
          <option value="workspace">Workspace</option>
          <option value="lifestyle-tech">Lifestyle Tech</option>
        </select>
        <select name="sort" defaultValue={sort} className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none">
          <option value="popularity">Sort by popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
        <button className="button-primary">Apply filters</button>
      </form>
      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-10 text-center">
          <h2 className="text-2xl font-semibold text-primary">No products matched those filters.</h2>
          <p className="mt-3 text-sm text-slate-600">Try a broader search, remove the category filter, or sort by popularity.</p>
        </div>
      )}
    </section>
  );
}
