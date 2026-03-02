"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SearchButton } from "./SearchDialog";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 border-b border-[var(--border)] backdrop-blur-md transition-all ${scrolled ? "bg-[var(--card)]/90 shadow-sm" : "bg-[var(--card)]/80"}`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="DevTools Online"
            width={140}
            height={36}
            className="h-8 w-auto transition-transform group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 text-sm md:flex">
          {["Text", "Developer", "Generators", "Design"].map((cat) => (
            <Link
              key={cat}
              href={`/#${cat.toLowerCase()}`}
              className="rounded-md px-3 py-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Right side: search + theme + mobile menu */}
        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] md:hidden hover:bg-[var(--muted)] btn-press"
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="animate-slide-down border-t border-[var(--border)] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {[
              { label: "Text Tools", href: "/#text" },
              { label: "Developer Tools", href: "/#developer" },
              { label: "Generators", href: "/#generators" },
              { label: "Design Tools", href: "/#design" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
