"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

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

  const faqs = [
    {
      question: "What characters are removed from slugs?",
      answer:
        "All special characters, punctuation, and symbols are removed. Accented characters (\u00e9, \u00f1, \u00fc) are transliterated to their ASCII equivalents. Only letters, numbers, and the chosen separator remain.",
    },
    {
      question: "Should I use hyphens or underscores in URLs?",
      answer:
        "Google recommends hyphens (-) as word separators in URLs. Hyphens are treated as word separators by search engines, while underscores (_) are not. Use hyphens for SEO-friendly URLs.",
    },
    {
      question: "How long should a URL slug be?",
      answer:
        "Keep slugs between 3-5 words (50-60 characters). Shorter slugs are easier to share and remember. Remove stop words like 'a', 'the', 'is', 'and' to keep slugs concise while maintaining meaning.",
    },
  ];

  return (
    <ToolLayout
      title="Slug Generator"
      description="Generate clean, URL-friendly slugs from any text. Handles accents, special characters, and custom separators."
      slug="slug-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Generate URL Slugs",
              content:
                "Enter any text \u2014 a blog post title, product name, or page heading \u2014 and get a clean, URL-friendly slug instantly. The tool converts text to lowercase, replaces spaces with hyphens, removes special characters, and handles accented characters. You can customize the separator (hyphen, underscore, or dot) and toggle options like lowercase conversion.",
            },
            {
              title: "Why Clean URL Slugs Matter for SEO",
              content:
                "URL slugs are the human-readable part of a URL after the domain (e.g., /how-to-generate-slugs). Clean, descriptive slugs improve SEO by including relevant keywords that search engines use for ranking. They also improve user experience \u2014 users can understand what a page is about just by reading the URL. Best practices: keep slugs short (3-5 words), use hyphens as separators, avoid stop words, and never include special characters or spaces.",
            },
          ]}
          faqs={faqs}
        />
      }
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
