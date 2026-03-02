"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

async function hashText(
  text: string,
  algorithm: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const ALGORITHMS = [
  { label: "SHA-1", value: "SHA-1" },
  { label: "SHA-256", value: "SHA-256" },
  { label: "SHA-384", value: "SHA-384" },
  { label: "SHA-512", value: "SHA-512" },
];

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generateAll = async () => {
    if (!input) return;
    const results: Record<string, string> = {};
    for (const algo of ALGORITHMS) {
      results[algo.label] = await hashText(input, algo.value);
    }
    setHashes(results);
  };

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes from any text."
      slug="hash-generator"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={4}
        />
      </div>

      <button
        onClick={generateAll}
        className="mt-3 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
      >
        Generate Hashes
      </button>

      {Object.keys(hashes).length > 0 && (
        <div className="mt-4 space-y-3">
          {ALGORITHMS.map((algo) => (
            <div key={algo.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{algo.label}</span>
                <CopyButton text={hashes[algo.label] || ""} />
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs font-mono break-all">
                {hashes[algo.label]}
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
