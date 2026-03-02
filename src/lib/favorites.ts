const STORAGE_KEY = "favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(slug);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(slug);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  } catch {
    // localStorage full or unavailable
  }
  return idx < 0; // returns true if now favorited
}
