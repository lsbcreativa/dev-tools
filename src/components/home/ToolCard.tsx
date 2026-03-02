"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Tool } from "@/lib/tools";
import { iconMap } from "@/lib/icons";
import { ArrowRight, Heart } from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

const NEW_TOOL_THRESHOLD = 50;

export default function ToolCard({
  tool,
  index = 0,
  globalIndex,
  compact = false,
}: {
  tool: Tool;
  index?: number;
  globalIndex?: number;
  compact?: boolean;
}) {
  const Icon = iconMap[tool.icon];
  const [fav, setFav] = useState(false);
  const isNew = globalIndex !== undefined && globalIndex >= NEW_TOOL_THRESHOLD;

  useEffect(() => {
    setFav(isFavorite(tool.slug));
  }, [tool.slug]);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFav = toggleFavorite(tool.slug);
    setFav(nowFav);
    window.dispatchEvent(new Event("favorites-changed"));
  };

  if (compact) {
    return (
      <Link
        href={`/${tool.slug}`}
        prefetch={false}
        className="group flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3 card-hover"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
          {Icon && <Icon size={16} />}
        </div>
        <span className="text-sm font-medium truncate">{tool.name}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/${tool.slug}`}
      prefetch={false}
      className={`group relative flex flex-col rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 card-hover animate-slide-up stagger-${Math.min(index + 1, 5)}`}
    >
      {isNew && (
        <span className="absolute top-3 right-3 rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold uppercase text-white tracking-wider">
          New
        </span>
      )}

      <button
        onClick={handleFav}
        className={`absolute ${isNew ? "top-3 right-14" : "top-3 right-3"} rounded-full p-1.5 transition-all hover:scale-110 btn-press ${
          fav
            ? "text-red-500"
            : "text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100"
        }`}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={16} fill={fav ? "currentColor" : "none"} />
      </button>

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
        {Icon && <Icon size={20} />}
      </div>

      <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">
        {tool.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)] flex-1">
        {tool.description}
      </p>

      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
        Open tool <ArrowRight size={12} />
      </div>
    </Link>
  );
}
