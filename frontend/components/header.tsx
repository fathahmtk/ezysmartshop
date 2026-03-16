"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/account", label: "Account" },
  { href: "/admin", label: "Admin" }
];

export function Header() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-50 border-b border-white/70 bg-shell/80 backdrop-blur-xl"
    >
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-slate-200 p-2 lg:hidden" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
            EZY Smart Shop
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 p-2" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <Link href="/account" className="rounded-full border border-slate-200 p-2" aria-label="Account">
            <User className="h-4 w-4" />
          </Link>
          <Link href="/cart" className="rounded-full bg-primary p-2 text-white" aria-label="Cart">
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

