"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { tools } from "@/lib/tools";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
      )
    : tools;

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelected(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const handleNavigate = useCallback(
    (slug: string) => {
      handleClose();
      router.push(`/${slug}`);
    },
    [handleClose, router]
  );

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) handleClose();
        else handleOpen();
      }
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleOpen, handleClose]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation within results
  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      handleNavigate(filtered[selected].slug);
    }
  };

  if (!open) return null;

  return (
    <div
      className="search-overlay fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[15vh]"
      onClick={handleClose}
    >
      <div
        className="search-dialog w-full max-w-lg rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-2xl overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
          <Search size={18} className="text-[var(--muted-foreground)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-sm outline-none border-none placeholder:text-[var(--muted-foreground)]"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 text-[10px] font-mono text-[var(--muted-foreground)]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-[var(--muted-foreground)]">
              No tools found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((tool, i) => (
              <button
                key={tool.slug}
                onClick={() => handleNavigate(tool.slug)}
                onMouseEnter={() => setSelected(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  i === selected
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "hover:bg-[var(--muted)]"
                }`}
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{tool.name}</div>
                  <div
                    className={`text-xs truncate ${
                      i === selected
                        ? "text-[var(--primary-foreground)]/70"
                        : "text-[var(--muted-foreground)]"
                    }`}
                  >
                    {tool.description}
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className={`shrink-0 ${
                    i === selected ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-[var(--border)] px-4 py-2 text-[10px] text-[var(--muted-foreground)] flex gap-4">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

// Button to trigger search from Navbar
export function SearchButton() {
  const [, setTrigger] = useState(0);

  const handleClick = () => {
    // Dispatch Cmd+K event
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
    );
    setTrigger((t) => t + 1);
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--muted-foreground)] transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)] btn-press"
      aria-label="Search tools"
    >
      <Search size={14} />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 text-[10px] font-mono">
        ⌘K
      </kbd>
    </button>
  );
}
