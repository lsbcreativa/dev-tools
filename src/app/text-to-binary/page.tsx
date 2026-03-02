"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

type Mode = "text-to-binary" | "binary-to-text";
type Encoding = "binary" | "hex" | "octal" | "decimal";
type Separator = "space" | "comma" | "none";

function charToEncoded(char: string, encoding: Encoding): string {
  const code = char.charCodeAt(0);
  switch (encoding) {
    case "binary":
      return code.toString(2).padStart(8, "0");
    case "hex":
      return code.toString(16).toUpperCase().padStart(2, "0");
    case "octal":
      return code.toString(8).padStart(3, "0");
    case "decimal":
      return code.toString(10);
  }
}

function textToEncoded(text: string, encoding: Encoding, separator: Separator): string {
  if (!text) return "";
  const sep = separator === "space" ? " " : separator === "comma" ? ", " : "";
  return Array.from(text)
    .map((ch) => charToEncoded(ch, encoding))
    .join(sep);
}

function encodedToText(input: string, encoding: Encoding, separator: Separator): string {
  if (!input.trim()) return "";

  let parts: string[];
  if (separator === "none") {
    // Split by known chunk size
    const chunkSize = encoding === "binary" ? 8 : encoding === "hex" ? 2 : encoding === "octal" ? 3 : 0;
    if (chunkSize > 0) {
      const cleaned = input.replace(/\s/g, "");
      parts = [];
      for (let i = 0; i < cleaned.length; i += chunkSize) {
        parts.push(cleaned.slice(i, i + chunkSize));
      }
    } else {
      // Decimal with no separator is ambiguous, try splitting by spaces anyway
      parts = input.trim().split(/[\s,]+/);
    }
  } else {
    const sepChar = separator === "comma" ? /,\s*/ : /\s+/;
    parts = input.trim().split(sepChar).filter(Boolean);
  }

  const radix = encoding === "binary" ? 2 : encoding === "hex" ? 16 : encoding === "octal" ? 8 : 10;

  return parts
    .map((part) => {
      const code = parseInt(part.trim(), radix);
      if (isNaN(code) || code < 0 || code > 65535) {
        throw new Error(`Invalid value: "${part.trim()}"`);
      }
      return String.fromCharCode(code);
    })
    .join("");
}

const encodingLabels: { value: Encoding; label: string; example: string }[] = [
  { value: "binary", label: "Binary", example: "01001000" },
  { value: "hex", label: "Hexadecimal", example: "48" },
  { value: "octal", label: "Octal", example: "110" },
  { value: "decimal", label: "Decimal", example: "72" },
];

const separatorLabels: { value: Separator; label: string }[] = [
  { value: "space", label: "Space" },
  { value: "comma", label: "Comma" },
  { value: "none", label: "None" },
];

export default function TextToBinaryTool() {
  const [mode, setMode] = useState<Mode>("text-to-binary");
  const [input, setInput] = useState("");
  const [encoding, setEncoding] = useState<Encoding>("binary");
  const [separator, setSeparator] = useState<Separator>("space");
  const [error, setError] = useState("");

  const output = useMemo(() => {
    setError("");
    if (!input) return "";
    try {
      if (mode === "text-to-binary") {
        return textToEncoded(input, encoding, separator);
      } else {
        return encodedToText(input, encoding, separator);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed. Check your input.");
      return "";
    }
  }, [input, mode, encoding, separator]);

  const charCount = mode === "text-to-binary" ? input.length : output.length;

  const faqs = [
    {
      question: "How many bits does each character use?",
      answer: "Standard ASCII characters use 7 bits (0-127), but are typically stored in 8 bits (1 byte). UTF-8 encoded characters use 1-4 bytes depending on the character — basic Latin characters use 1 byte, accented characters use 2 bytes, and emoji use 4 bytes.",
    },
    {
      question: "What is the difference between ASCII and Unicode?",
      answer: "ASCII encodes 128 characters (English letters, digits, symbols) using 7 bits. Unicode supports over 149,000 characters from all writing systems, emoji, and symbols. UTF-8 is the most common Unicode encoding on the web.",
    },
    {
      question: "Can I convert emoji to binary?",
      answer: "Yes, though emoji require 4 bytes (32 bits) in UTF-8 encoding. For example, the smiley face emoji uses the code point U+1F600, which becomes 11110000 10011111 10011000 10000000 in UTF-8 binary.",
    },
  ];

  return (
    <ToolLayout
      title="Text to Binary Converter"
      description="Convert text to binary, hexadecimal, octal, or decimal and back."
      slug="text-to-binary"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert Text to Binary and Back",
              content: "Enter text to see its binary representation, or paste binary code to convert it back to readable text. Each character is converted to its ASCII or Unicode value and represented in binary (base 2), octal (base 8), decimal (base 10), or hexadecimal (base 16). The tool supports all printable ASCII characters and common Unicode characters.",
            },
            {
              title: "Understanding Binary Text Encoding",
              content: "Computers store all data as binary — sequences of 0s and 1s. Each ASCII character is represented by 7 or 8 bits: 'A' is 01000001 (65 in decimal), 'a' is 01100001 (97), and '0' is 00110000 (48). Unicode extends this to support characters from all writing systems using UTF-8, UTF-16, or UTF-32 encoding. Binary-to-text conversion is fundamental to understanding how computers process and store text data.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode("text-to-binary"); setInput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "text-to-binary"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          Text &rarr; Encoded
        </button>
        <button
          onClick={() => { setMode("binary-to-text"); setInput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "binary-to-text"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          Encoded &rarr; Text
        </button>
      </div>

      {/* Encoding mode & separator */}
      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Encoding</label>
          <div className="flex flex-wrap gap-2">
            {encodingLabels.map((enc) => (
              <button
                key={enc.value}
                onClick={() => setEncoding(enc.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors btn-press ${
                  encoding === enc.value
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border border-[var(--border)] hover:bg-[var(--muted)]"
                }`}
              >
                {enc.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Separator</label>
          <div className="flex flex-wrap gap-2">
            {separatorLabels.map((sep) => (
              <button
                key={sep.value}
                onClick={() => setSeparator(sep.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors btn-press ${
                  separator === sep.value
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border border-[var(--border)] hover:bg-[var(--muted)]"
                }`}
              >
                {sep.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          {mode === "text-to-binary" ? "Text Input" : `Encoded Input (${encodingLabels.find((e) => e.value === encoding)?.label})`}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "text-to-binary"
              ? "Type text here..."
              : `Enter ${encoding} values (e.g. ${encodingLabels.find((e) => e.value === encoding)?.example})`
          }
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={4}
        />
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {charCount} character{charCount !== 1 ? "s" : ""}
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {output && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {mode === "text-to-binary" ? `${encodingLabels.find((e) => e.value === encoding)?.label} Output` : "Text Output"}
            </span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
