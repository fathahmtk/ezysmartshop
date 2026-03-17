import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/70 bg-[#f1e7da]">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">EZ</div>
            <div>
              <p className="text-lg font-semibold text-primary">EZY Smart Shop</p>
              <p className="text-xs tracking-[0.18em] text-slate-500">CURATED SMART ESSENTIALS</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-600">
            Practical gadgets and home upgrades designed for high-trust shopping, fast delivery, and repeat purchase.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            <span className="rounded-full bg-white px-3 py-2">COD available</span>
            <span className="rounded-full bg-white px-3 py-2">Secure payments</span>
            <span className="rounded-full bg-white px-3 py-2">Fast dispatch</span>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="soft-label">Shop</p>
          <div className="space-y-3">
            <Link href="/shop" className="block hover:text-primary">All Products</Link>
            <Link href="/shop?sort=popularity" className="block hover:text-primary">Best Sellers</Link>
            <Link href="/cart" className="block hover:text-primary">Cart</Link>
            <Link href="/checkout" className="block hover:text-primary">Checkout</Link>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="soft-label">Company</p>
          <div className="space-y-3">
            <Link href="/account" className="block hover:text-primary">My Account</Link>
            <Link href="/admin" className="block hover:text-primary">Admin Panel</Link>
            <Link href="/shop?category=smart-home" className="block hover:text-primary">Smart Home</Link>
            <Link href="/shop?category=workspace" className="block hover:text-primary">Workspace</Link>
          </div>
        </div>
        <div className="space-y-4 text-sm text-slate-600">
          <p className="soft-label">Support</p>
          <div className="surface-card space-y-3 p-5">
            <p className="font-semibold text-slate-900">Need help before checkout?</p>
            <p>support@ezysmartshop.com</p>
            <p>Mon-Sat, 10:00 AM to 7:00 PM IST</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Average response time under 2 hours</p>
          </div>
        </div>
      </div>
      <div className="container-shell border-t border-slate-300/50 py-4 text-xs text-slate-500">
        EZY Smart Shop. Conversion-first ecommerce storefront for smart utility products.
      </div>
    </footer>
  );
}

