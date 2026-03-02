"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function generateSlug(
  text: string,
  separator: string,
  lowercase: boolean,
  removeSpecial: boolean
): string {
  let slug = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  slug = slug.trim();

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  if (removeSpecial) {
    slug = slug.replace(/[^a-zA-Z0-9\s-_]/g, "");
  }

  slug = slug.replace(/[\s]+/g, separator);
  const escapedSep = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  slug = slug.replace(new RegExp(`${escapedSep}{2,}`, "g"), separator);
  slug = slug.replace(new RegExp(`^${escapedSep}|${escapedSep}$`, "g"), "");

  return slug;
}

export default function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeSpecial, setRemoveSpecial] = useState(true);

  const slug = useMemo(
    () => generateSlug(input, separator, lowercase, removeSpecial),
    [input, separator, lowercase, removeSpecial]
  );

  return (
    <ToolLayout
      title="Slug Generator"
      description="Generate clean, URL-friendly slugs from any text. Handles accents, special characters, and custom separators."
      slug="slug-generator"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to a slug..."
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={3}
        />
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {input.length} character{input.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Options */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Separator</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-sm"
          >
            <option value="-">Dash (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>

        <div className="flex items-center gap-4 pt-5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded"
            />
            Lowercase
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removeSpecial}
              onChange={(e) => setRemoveSpecial(e.target.checked)}
              className="rounded"
            />
            Remove special characters
          </label>
        </div>
      </div>

      {/* Output */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Generated Slug</span>
          {slug && <CopyButton text={slug} />}
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
          {slug || <span className="text-[var(--muted-foreground)]">Your slug will appear here...</span>}
        </div>
      </div>
    </ToolLayout>
  );
}
