import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, Globe } from "lucide-react";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description: "DevTools Online offers 70+ free developer tools that run entirely in your browser. No servers, no signups, no data collection.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-extrabold tracking-tight">About DevTools Online</h1>
      <p className="mt-3 text-lg text-[var(--muted-foreground)] leading-relaxed">
        DevTools Online offers {tools.length} free developer tools that run entirely in your browser.
        Your data never leaves your device &mdash; no servers, no tracking, no data collection.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <Zap size={24} className="text-[var(--primary)] mb-3" />
          <h3 className="font-semibold text-sm">Fast & Lightweight</h3>
          <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
            Static site with zero server processing. Tools load instantly and work offline.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <Shield size={24} className="text-[var(--primary)] mb-3" />
          <h3 className="font-semibold text-sm">Privacy First</h3>
          <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
            No cookies, no tracking, no analytics. Your data stays in your browser.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <Globe size={24} className="text-[var(--primary)] mb-3" />
          <h3 className="font-semibold text-sm">Always Free</h3>
          <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
            No paywalls, no signup, no limits. Free tools for every developer.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Our Mission</h2>
          <p>
            We built DevTools Online because too many online tools require signups, send your
            data to servers, or lock features behind paywalls. Every tool here runs 100% in
            your browser and always will.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Available Tools</h2>
          <p className="mb-3">
            We currently offer {tools.length} tools across text processing, developer utilities,
            generators, and design tools:
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/${tool.slug}`}
                  className="text-[var(--primary)] hover:underline underline-offset-2"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Technology</h2>
          <p>
            Built with Next.js, React, and Tailwind CSS. Deployed as a fully static site
            with no backend, no database, and no server-side processing.
          </p>
        </section>
      </div>
    </div>
  );
}
