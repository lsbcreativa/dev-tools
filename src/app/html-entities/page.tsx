"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

const entityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
  "/": "&#x2F;",
};

const reverseEntityMap: Record<string, string> = {};
for (const [char, entity] of Object.entries(entityMap)) {
  reverseEntityMap[entity] = char;
}

function encodeEntities(str: string): string {
  return str.replace(/[&<>"'/]/g, (char) => entityMap[char] || char);
}

function decodeEntities(str: string): string {
  const textarea = typeof document !== "undefined" ? document.createElement("textarea") : null;
  if (textarea) {
    textarea.innerHTML = str;
    return textarea.value;
  }
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x2F;/g, "/");
}

export default function HtmlEntities() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleConvert = () => {
    if (mode === "encode") {
      setOutput(encodeEntities(input));
    } else {
      setOutput(decodeEntities(input));
    }
  };

  return (
    <ToolLayout
      title="HTML Entity Encoder / Decoder"
      description="Convert special characters to HTML entities and vice versa."
      slug="html-entities"
    >
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode("encode"); setOutput(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "encode"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode("decode"); setOutput(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "decode"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          Decode
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "encode"
            ? 'Enter HTML like <div class="test">Hello & World</div>'
            : "Enter encoded HTML entities like &lt;div&gt;..."
        }
        className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
        rows={5}
      />

      <button
        onClick={handleConvert}
        className="mt-3 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
      >
        {mode === "encode" ? "Encode to Entities" : "Decode Entities"}
      </button>

      {output && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Result</span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
        <h3 className="mb-2 text-sm font-medium">Common HTML Entities</h3>
        <div className="grid grid-cols-2 gap-1 text-xs font-mono sm:grid-cols-3">
          {Object.entries(entityMap).map(([char, entity]) => (
            <div key={char} className="flex gap-2">
              <span className="text-[var(--primary)] font-medium w-8">{char === " " ? "space" : char}</span>
              <span className="text-[var(--muted-foreground)]">{entity}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
