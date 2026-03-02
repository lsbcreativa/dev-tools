import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/lib/tools";

export default function Footer() {
  const categoryKeys = Object.keys(categories) as ToolCategory[];

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="DevTools Online"
              className="h-14 w-auto"
            />
            <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-xs leading-relaxed">
              {tools.length}+ developer tools that run in your browser. No servers, no signups.
            </p>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              {tools.length} tools available
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {categoryKeys.map((cat) => {
              const count = tools.filter((t) => t.category === cat).length;
              return (
                <Link
                  key={cat}
                  href={`/#${cat}`}
                  className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  <span className="font-medium">{categories[cat].label}</span>
                  <span className="ml-1.5 text-xs text-[var(--muted-foreground)]">({count})</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted-foreground)] sm:flex-row">
          <p>&copy; {new Date().getFullYear()} DevTools Online. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="transition-colors hover:text-[var(--foreground)]">About</Link>
            <Link href="/privacy" className="transition-colors hover:text-[var(--foreground)]">Privacy Policy</Link>
            <span>100% client-side &middot; No cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
