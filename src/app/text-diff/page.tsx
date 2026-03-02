"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

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

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two texts and highlight the differences between them."
      slug="text-diff"
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
