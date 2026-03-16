import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white/80">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-primary">EZY Smart Shop</p>
          <p className="text-sm text-slate-600">
            Smart gadgets and home utility products built for modern Indian households.
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Shop</p>
          <Link href="/shop">All Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Company</p>
          <Link href="/account">My Account</Link>
          <Link href="/admin">Admin Panel</Link>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Support</p>
          <p>support@ezysmartshop.com</p>
          <p>Mon-Sat, 10:00 AM to 7:00 PM IST</p>
        </div>
      </div>
    </footer>
  );
}

