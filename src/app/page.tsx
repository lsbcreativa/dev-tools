import ToolCard from "@/components/home/ToolCard";
import {
  FeaturedTools,
  FavoritesSection,
  RecentTools,
  SearchHint,
} from "@/components/home/HomeClient";
import { Zap, Shield, Sparkles } from "lucide-react";
import {
  tools,
  categories,
  getToolsByCategory,
  type ToolCategory,
} from "@/lib/tools";

export default function Home() {
  const categoryKeys = Object.keys(categories) as ToolCategory[];

  return (
    <div className="hero-bg-glow">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-xs font-medium text-[var(--muted-foreground)] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            {tools.length} tools available &mdash; 100% free
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Free Online{" "}
            <span className="hero-gradient">Developer Tools</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            The developer toolkit that respects your privacy. 70+ tools that run
            entirely in your browser &mdash; no servers, no signups, no data collection.
          </p>
          <SearchHint />
        </div>

        {/* Why DevTools Online */}
        <div className="mb-16 grid gap-4 sm:grid-cols-3 animate-fade-in">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Zap size={20} />
            </div>
            <h3 className="font-semibold text-sm">Instant &amp; Fast</h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
              Every tool runs client-side with zero latency. No loading spinners, no API calls &mdash; just instant results.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Shield size={20} />
            </div>
            <h3 className="font-semibold text-sm">100% Private</h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
              Your data never leaves your device. Zero telemetry, zero cookies, zero third-party scripts.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Sparkles size={20} />
            </div>
            <h3 className="font-semibold text-sm">Always Free</h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
              No accounts required. No paywalls. No usage limits. Open to everyone, forever.
            </p>
          </div>
        </div>

        {/* Dynamic sections (client-side) */}
        <FavoritesSection />
        <RecentTools />
        <FeaturedTools />

        {/* Tool categories */}
        {categoryKeys.map((category) => {
          const categoryTools = getToolsByCategory(category);
          const cat = categories[category];
          return (
            <section key={category} id={category} className="mb-14">
              <div className="mb-5">
                <h2 className="text-xl font-bold">{cat.label}</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{cat.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool, i) => {
                  const globalIdx = tools.indexOf(tool);
                  return (
                    <ToolCard key={tool.slug} tool={tool} index={i} globalIndex={globalIdx} />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
