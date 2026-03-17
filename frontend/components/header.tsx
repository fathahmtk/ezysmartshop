"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, Search, ShieldCheck, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/account", label: "Account" }
];

export function Header() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-white/70 bg-shell/80 backdrop-blur-xl"
    >
      <div className="container-shell flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="rounded-full border border-slate-200 p-2 lg:hidden"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <Link href="/" className="flex items-center gap-3 text-base font-semibold tracking-tight text-primary">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              EZ
            </div>
            <span className="hidden text-[10px] uppercase tracking-[0.4em] text-slate-500 lg:block">UTILITY GADGETS</span>
          </Link>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700 md:flex">
          <ShieldCheck className="h-4 w-4" />
          Secure checkout + COD
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-300 bg-white p-2.5" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <Link href="/account" className="rounded-full border border-slate-300 bg-white p-2.5" aria-label="Account">
            <User className="h-4 w-4" />
          </Link>
          <Link href="/cart" className="relative rounded-full bg-primary p-2.5 text-white shadow-lg shadow-slate-900/15" aria-label="Cart">
            <ShoppingBag className="h-4 w-4" />
            {cartCount ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
        <div className="hidden flex-1 items-center justify-center gap-6 text-sm text-slate-600 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-primary ${pathname === link.href ? "font-semibold text-primary" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="container-shell border-t border-white/80 bg-shell/80 px-5 py-2 text-xs uppercase tracking-[0.22em] text-slate-500">
        <div className="hidden lg:flex items-center gap-4">
          <span>Free shipping above Rs 999</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>7-day replacement</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Secure payments + COD</span>
        </div>
        {isMenuOpen ? (
          <nav id="mobile-navigation" className="lg:hidden flex flex-wrap gap-3 pt-3 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full border border-slate-200 px-4 py-2 transition ${pathname === link.href ? "bg-slate-100 font-semibold text-primary" : "bg-white text-slate-600"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </motion.header>
  );
}
