const STORAGE_KEY = "recent-tools";
const MAX_RECENT = 8;

export function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecent(slug: string): void {
  const recent = getRecent().filter((s) => s !== slug);
  recent.unshift(slug);
  if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch {
    // localStorage full or unavailable
  }
}
