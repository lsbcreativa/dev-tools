"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

interface DiffLine {
  type: "added" | "removed" | "same";
  text: string;
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const origLines = original.split("\n");
  const modLines = modified.split("\n");
  const result: DiffLine[] = [];

  const maxLen = Math.max(origLines.length, modLines.length);

  for (let i = 0; i < maxLen; i++) {
    const origLine = origLines[i];
    const modLine = modLines[i];

    if (origLine === undefined && modLine !== undefined) {
      result.push({ type: "added", text: modLine });
    } else if (origLine !== undefined && modLine === undefined) {
      result.push({ type: "removed", text: origLine });
    } else if (origLine !== modLine) {
      result.push({ type: "removed", text: origLine });
      result.push({ type: "added", text: modLine });
    } else {
      result.push({ type: "same", text: origLine });
    }
  }

  return result;
}

export default function TextDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  const handleCompare = () => {
    setDiff(computeDiff(original, modified));
  };

  const faqs = [
    {
      question: "Can I compare code with this tool?",
      answer:
        "Yes, this tool works with any plain text including source code. For syntax-highlighted code diffs, consider using the Code Diff Viewer tool which provides language-aware highlighting.",
    },
    {
      question: "Does it detect moved text?",
      answer:
        "The diff algorithm compares text line by line and highlights additions and deletions. Moved text appears as a deletion in the original position and an addition in the new position.",
    },
    {
      question: "Is there a size limit for text comparison?",
      answer:
        "There is no hard limit, but very large texts (over 100,000 characters) may cause slower processing since everything runs in your browser. For typical documents and code files, performance is instant.",
    },
  ];

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two texts and highlight the differences between them."
      slug="text-diff"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Compare Two Texts Online",
              content:
                "Paste your original text on the left and the modified text on the right. The tool highlights the differences between them instantly \u2014 green for additions, red for deletions, and yellow for modifications. This is useful for comparing document versions, reviewing code changes, checking translation differences, and verifying edits.",
            },
            {
              title: "Text Comparison Use Cases",
              content:
                "Text diff tools are essential for developers reviewing code changes, writers tracking document revisions, translators comparing original and translated text, and editors verifying corrections. Unlike simple text comparison, diff highlighting shows exactly what changed and where, making it easy to spot even subtle differences in punctuation, spacing, or wording.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Original Text</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={10}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Modified Text</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={10}
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="mt-4 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] btn-press"
      >
        Compare
      </button>

      {diff && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium">Diff Result</h3>
          <div className="rounded-lg border border-[var(--border)] overflow-hidden">
            <pre className="p-4 text-sm font-mono overflow-x-auto">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "added"
                      ? "bg-[var(--success)]/10 text-[var(--success)]"
                      : line.type === "removed"
                        ? "bg-[var(--destructive)]/10 text-[var(--destructive)]"
                        : ""
                  }
                >
                  <span className="inline-block w-6 text-center opacity-50 select-none">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  {line.text}
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
