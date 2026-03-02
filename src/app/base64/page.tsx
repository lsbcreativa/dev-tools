"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(
        mode === "decode"
          ? "Invalid Base64 string. Make sure the input is valid Base64."
          : "Could not encode the input."
      );
      setOutput("");
    }
  };

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 strings back to plain text."
      slug="base64"
      faqs={[
        { question: "What is Base64 encoding?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data using 64 ASCII characters (A-Z, a-z, 0-9, +, /). It is commonly used to embed images in HTML/CSS, encode email attachments, and transmit binary data over text-based protocols." },
        { question: "Is Base64 encoding the same as encryption?", answer: "No. Base64 is an encoding scheme, not encryption. Anyone can decode Base64 data without a key. It is designed for data transport, not security. Never use Base64 to protect sensitive information." },
        { question: "Can I encode files to Base64?", answer: "This tool encodes and decodes text strings. For file encoding (images, PDFs), use our Image to Base64 tool which handles binary file data." }
      ]}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Encode and Decode Base64", content: "Enter your text in the input field and click Convert. In encode mode, the tool converts your text to a Base64 string. In decode mode, it converts a Base64 string back to readable text. The tool supports full UTF-8 characters including emojis, accented characters, and non-Latin scripts." },
            { title: "Common Uses for Base64 Encoding", content: "Base64 is used in data URIs for embedding images in CSS and HTML, in JWT tokens for encoding header and payload sections, in email (MIME) for transmitting attachments, and in APIs that need to send binary data as JSON string values. It increases data size by approximately 33%." }
          ]}
          faqs={[
            { question: "What is Base64 encoding?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data using 64 ASCII characters (A-Z, a-z, 0-9, +, /). It is commonly used to embed images in HTML/CSS, encode email attachments, and transmit binary data over text-based protocols." },
            { question: "Is Base64 encoding the same as encryption?", answer: "No. Base64 is an encoding scheme, not encryption. Anyone can decode Base64 data without a key. It is designed for data transport, not security. Never use Base64 to protect sensitive information." },
            { question: "Can I encode files to Base64?", answer: "This tool encodes and decodes text strings. For file encoding (images, PDFs), use our Image to Base64 tool which handles binary file data." }
          ]}
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

      <div>
        <label className="mb-1 block text-sm font-medium">
          {mode === "encode" ? "Text to encode" : "Base64 to decode"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={5}
        />
      </div>

      <button
        onClick={handleConvert}
        className="mt-3 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
      >
        {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
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
