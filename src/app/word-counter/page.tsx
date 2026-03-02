"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

export default function WordCounter() {
  const [text, setText] = useState("");

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentences =
    text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs =
    text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <ToolLayout
      title="Word & Character Counter"
      description="Count words, characters, sentences, paragraphs and estimate reading time."
      slug="word-counter"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        className="w-full rounded-lg border border-[var(--border)] p-4 text-sm leading-relaxed"
        rows={10}
      />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Words", value: words },
          { label: "Characters", value: chars },
          { label: "No Spaces", value: charsNoSpaces },
          { label: "Sentences", value: sentences },
          { label: "Paragraphs", value: paragraphs },
          { label: "Reading Time", value: `${readingTime} min` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center"
          >
            <div className="text-2xl font-bold text-[var(--primary)]">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
