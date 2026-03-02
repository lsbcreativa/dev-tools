"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input.trim()));
      }
    } catch {
      setError("Invalid input. Please check and try again.");
      setOutput("");
    }
  };

  const faqs = [
    {
      question: "What is the difference between encodeURI and encodeURIComponent?",
      answer: "encodeURI encodes a full URI but preserves special URL characters like ://?#@. encodeURIComponent encodes everything except letters, digits, and - _ . ~ making it suitable for encoding query parameter values.",
    },
    {
      question: "Why are spaces encoded as %20 instead of +?",
      answer: "Both are valid. %20 is the standard URL encoding for spaces (RFC 3986). The + sign is an alternative used specifically in HTML form data (application/x-www-form-urlencoded). This tool uses %20 by default.",
    },
    {
      question: "Do I need to encode non-English characters in URLs?",
      answer: "Yes. Non-ASCII characters like accented letters (\u00e9, \u00f1), CJK characters, and emoji must be percent-encoded in URLs. They are converted to their UTF-8 byte sequences, then each byte is encoded as %XX.",
    },
  ];

  return (
    <ToolLayout
      title="URL Encoder / Decoder"
      description="Encode special characters in URLs or decode percent-encoded URL strings."
      slug="url-encoder"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Encode and Decode URLs",
              content: "Paste a URL or text string to encode special characters into percent-encoded format, or paste an encoded URL to decode it back to readable text. URL encoding replaces unsafe characters with a % sign followed by their hexadecimal value \u2014 for example, spaces become %20, ampersands become %26, and non-ASCII characters like \u00e9 become %C3%A9.",
            },
            {
              title: "When to Use URL Encoding",
              content: "URL encoding is required when passing special characters in query parameters, form data, API requests, and file paths. Characters like &, =, ?, #, and spaces have special meaning in URLs and must be encoded to be treated as literal values. Modern browsers handle basic encoding automatically, but developers often need to encode values manually when building API calls, constructing redirect URLs, or debugging encoded strings.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "encode"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
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
        placeholder={mode === "encode" ? "Enter URL or text to encode..." : "Enter encoded URL to decode..."}
        className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
        rows={4}
      />

      <button
        onClick={handleConvert}
        className="mt-3 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
      >
        {mode === "encode" ? "Encode URL" : "Decode URL"}
      </button>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

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
    </ToolLayout>
  );
}
