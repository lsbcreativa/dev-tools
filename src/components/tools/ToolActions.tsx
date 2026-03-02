"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { addRecent } from "@/lib/recent";

export default function ToolActions({ slug }: { slug: string }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(slug));
    addRecent(slug);
  }, [slug]);

  const handleFav = () => {
    const nowFav = toggleFavorite(slug);
    setFav(nowFav);
    window.dispatchEvent(new Event("favorites-changed"));
  };

  return (
    <button
      onClick={handleFav}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all btn-press ${
        fav
          ? "border-red-500/30 bg-red-500/10 text-red-500"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={14} fill={fav ? "currentColor" : "none"} />
      {fav ? "Favorited" : "Favorite"}
    </button>
  );
}
