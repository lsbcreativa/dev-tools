"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Clock, Star, Command } from "lucide-react";
import { getFavorites } from "@/lib/favorites";
import { getRecent } from "@/lib/recent";
import { getToolBySlug, tools } from "@/lib/tools";
import { iconMap } from "@/lib/icons";
import ToolCard from "./ToolCard";

const FEATURED_SLUGS = [
  "json-formatter",
  "regex-tester",
  "password-generator",
  "base64",
  "jwt-decoder",
  "json-to-typescript",
];

export function FeaturedTools() {
  const featured = FEATURED_SLUGS.map((s) => getToolBySlug(s)).filter(Boolean);

  return (
    <section className="mb-14 animate-fade-in">
      <div className="mb-5 flex items-center gap-2">
        <Star size={18} className="text-[var(--primary)]" />
        <h2 className="text-xl font-bold">Featured Tools</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((tool, i) => {
          const globalIdx = tools.findIndex((t) => t.slug === tool!.slug);
          return (
            <ToolCard key={tool!.slug} tool={tool!} index={i} globalIndex={globalIdx} />
          );
        })}
      </div>
    </section>
  );
}

export function FavoritesSection() {
  const [favSlugs, setFavSlugs] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setFavSlugs(getFavorites());
    update();
    window.addEventListener("favorites-changed", update);
    return () => window.removeEventListener("favorites-changed", update);
  }, []);

  if (favSlugs.length === 0) return null;

  const favTools = favSlugs.map((s) => getToolBySlug(s)).filter(Boolean);

  return (
    <section className="mb-14 animate-fade-in">
      <div className="mb-5 flex items-center gap-2">
        <Heart size={18} className="text-red-500" />
        <h2 className="text-xl font-bold">My Favorites</h2>
        <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
          {favTools.length}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favTools.map((tool, i) => {
          const globalIdx = tools.findIndex((t) => t.slug === tool!.slug);
          return (
            <ToolCard key={tool!.slug} tool={tool!} index={i} globalIndex={globalIdx} />
          );
        })}
      </div>
    </section>
  );
}

export function RecentTools() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    setRecentSlugs(getRecent());
  }, []);

  if (recentSlugs.length === 0) return null;

  const recentTools = recentSlugs.map((s) => getToolBySlug(s)).filter(Boolean);

  return (
    <section className="mb-14 animate-fade-in">
      <div className="mb-5 flex items-center gap-2">
        <Clock size={18} className="text-[var(--muted-foreground)]" />
        <h2 className="text-xl font-bold">Recently Used</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {recentTools.map((tool) => {
          const Icon = iconMap[tool!.icon];
          return (
            <Link
              key={tool!.slug}
              href={`/${tool!.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3 card-hover"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
                {Icon && <Icon size={16} />}
              </div>
              <span className="text-sm font-medium truncate">{tool!.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function SearchHint() {
  return (
    <div className="mt-6 flex justify-center animate-fade-in">
      <button
        onClick={() => {
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true })
          );
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--foreground)] btn-press"
      >
        <Command size={14} />
        <span>Press</span>
        <kbd className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-xs font-mono font-medium">
          Ctrl+K
        </kbd>
        <span>to search {tools.length} tools</span>
      </button>
    </div>
  );
}
