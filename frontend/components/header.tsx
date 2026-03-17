"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
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
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-white/70 bg-shell/80 backdrop-blur-xl"
    >
      <div className="container-shell flex items-center justify-between gap-4 px-3 py-3 lg:py-4">
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
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/70 bg-white p-1">
              <Image
                src="/logo.svg"
                alt="EZY Smart Shop"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span className="text-sm text-primary">EZY Smart Shop</span>
              <span>UTILITY GADGETS</span>
            </div>
          </Link>
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-primary ${pathname === link.href ? "text-primary" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-full bg-primary p-2.5 text-white shadow-lg shadow-slate-900/15"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <Link href="/account" className="rounded-full border border-slate-300 bg-white p-2.5" aria-label="Account">
            <User className="h-4 w-4 text-slate-700" />
          </Link>
        </div>
      </div>
      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          className="lg:hidden border-t border-white/70 bg-white/90 px-4 py-4 text-sm font-semibold tracking-[0.3em] text-slate-700"
        >
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full border border-slate-200 px-4 py-2 ${pathname === link.href ? "bg-slate-100 text-primary" : "bg-white"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </motion.header>
  );
}
