"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/account", label: "Account" },
  { href: "/admin", label: "Admin" }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-50 border-b border-white/70 bg-shell/80 backdrop-blur-xl"
    >
      <div className="container-shell flex items-center justify-between gap-4 py-4">
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
          <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
            EZY Smart Shop
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-primary ${pathname === link.href ? "font-semibold text-primary" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/shop" className="rounded-full border border-slate-200 p-2" aria-label="Search products">
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/account" className="rounded-full border border-slate-200 p-2" aria-label="Account">
            <User className="h-4 w-4" />
          </Link>
          <Link href="/cart" className="rounded-full bg-primary p-2 text-white" aria-label="Cart">
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>
      {isMenuOpen && (
        <nav id="mobile-navigation" className="border-t border-slate-200/80 bg-white/95 lg:hidden">
          <div className="container-shell flex flex-col py-3 text-sm text-slate-700">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-2 py-2 transition hover:bg-slate-100 ${pathname === link.href ? "bg-slate-100 font-semibold text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </motion.header>
  );
}
