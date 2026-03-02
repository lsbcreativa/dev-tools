"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

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

  const faqs = [
    {
      question: "What is the difference between named and numeric HTML entities?",
      answer: "Named entities use descriptive names (&amp;, &lt;, &copy;). Numeric entities use character codes (&#38;, &#60;, &#169;). Both render the same character. Named entities are more readable but not all characters have named entities.",
    },
    {
      question: "Do I need to encode all special characters in HTML?",
      answer: "Only characters with special meaning in HTML must be encoded: < > & \" and optionally '. Other characters like \u00a9, \u20ac, and accented letters can be used directly if your page uses UTF-8 encoding, but encoding them improves compatibility.",
    },
    {
      question: "How does HTML entity encoding prevent XSS attacks?",
      answer: "By converting < to &lt; and > to &gt;, any HTML tags in user input are displayed as text instead of being rendered as HTML. This prevents attackers from injecting malicious scripts through form fields or URL parameters.",
    },
  ];

  return (
    <ToolLayout
      title="HTML Entity Encoder / Decoder"
      description="Convert special characters to HTML entities and vice versa."
      slug="html-entities"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Encode and Decode HTML Entities",
              content: "Paste text containing special characters to convert them to HTML entities, or paste HTML-encoded text to decode it back. HTML entity encoding converts characters like <, >, &, and quotes into their entity equivalents (&lt;, &gt;, &amp;, &quot;) so they display correctly in HTML without being interpreted as markup.",
            },
            {
              title: "Why HTML Entity Encoding Matters",
              content: "HTML entity encoding prevents Cross-Site Scripting (XSS) attacks by ensuring user input is displayed as text rather than executed as HTML or JavaScript. It's essential when displaying user-generated content, email addresses (to prevent spam bots), special symbols (\u00a9, \u2122, \u20ac), and mathematical notation. Common entities include &amp; for &, &lt; for <, &gt; for >, &nbsp; for non-breaking space, and &copy; for \u00a9.",
            },
          ]}
          faqs={faqs}
        />
      }
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
