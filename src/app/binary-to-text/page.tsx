"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const faqs = [
  {
    question: "What is binary code?",
    answer:
      "Binary code is a system that represents data using only two symbols: 0 and 1. These digits are called bits (binary digits). Computers use binary because their electronic circuits have two states — on (1) and off (0). All data processed by a computer — text, images, audio — is ultimately stored and transmitted as sequences of binary digits.",
  },
  {
    question: "How does text to binary conversion work?",
    answer:
      "Each character in a text string has a numeric code defined by character encoding standards like ASCII or UTF-8. For ASCII, each character maps to a number from 0–127 (or 0–255 for extended ASCII). That number is then written in binary (base-2). For example, the letter 'A' has ASCII code 65, which in 8-bit binary is 01000001.",
  },
  {
    question: "Why use binary encoding?",
    answer:
      "Binary encoding is the fundamental language of computers. Understanding it is essential for low-level programming, digital electronics, networking, and cryptography. Binary to text conversion is also used for debugging, studying character encodings, and educational purposes in computer science.",
  },
  {
    question: "What is ASCII?",
    answer:
      "ASCII (American Standard Code for Information Interchange) is a character encoding standard that assigns numeric values to 128 characters including letters (A–Z, a–z), digits (0–9), punctuation marks, and control characters. Created in 1963, it remains the foundation for modern character encoding systems like UTF-8, which extends ASCII to support international characters.",
  },
];

type Mode = "binaryToText" | "textToBinary";
type Delimiter = "space" | "comma" | "none";

function binaryToText(binary: string, delimiter: Delimiter): string {
  let groups: string[];
  if (delimiter === "comma") {
    groups = binary.split(",").map((g) => g.trim());
  } else if (delimiter === "none") {
    // Split into 8-character chunks
    const clean = binary.replace(/\s/g, "");
    groups = [];
    for (let i = 0; i < clean.length; i += 8) {
      groups.push(clean.slice(i, i + 8));
    }
  } else {
    // space (default) — also handles multiple spaces/newlines
    groups = binary.trim().split(/[\s,]+/).filter(Boolean);
  }

  return groups
    .map((group) => {
      const trimmed = group.trim();
      if (!/^[01]+$/.test(trimmed)) return "";
      const code = parseInt(trimmed, 2);
      if (isNaN(code)) return "";
      return String.fromCharCode(code);
    })
    .join("");
}

function textToBinary(text: string, delimiter: string): string {
  const sep = delimiter === "space" ? " " : delimiter === "comma" ? "," : "";
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(sep);
}

function countBits(str: string): number {
  return (str.match(/[01]/g) || []).length;
}

export default function BinaryToTextTool() {
  const [mode, setMode] = useState<Mode>("binaryToText");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>("space");

  const handleConvert = () => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "binaryToText") {
        const result = binaryToText(input, delimiter);
        if (result === "" && input.trim().length > 0) {
          setError("Could not parse binary input. Check the delimiter setting and ensure all groups are valid binary (0s and 1s only).");
          setOutput("");
        } else {
          setOutput(result);
        }
      } else {
        setOutput(textToBinary(input, delimiter));
      }
    } catch {
      setError("Conversion failed. Please check your input.");
      setOutput("");
    }
  };

  const charCount = mode === "binaryToText" ? output.length : input.length;
  const bitCount = mode === "binaryToText" ? countBits(input) : countBits(output);

  const inputPlaceholder =
    mode === "binaryToText"
      ? "01001000 01100101 01101100 01101100 01101111"
      : "Hello, World!";

  return (
    <ToolLayout
      title="Binary to Text Converter"
      description="Convert binary code (0s and 1s) to readable text and text back to binary. Supports space, comma, and no-delimiter formats."
      slug="binary-to-text"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How Binary to Text Conversion Works",
              content:
                "Binary to text conversion works by grouping binary digits into 8-bit chunks (bytes), converting each byte from base-2 to a decimal number, then mapping that number to the corresponding character using an encoding table like ASCII or UTF-8. For example, the binary group 01001000 equals decimal 72, which is the ASCII code for the uppercase letter 'H'. This tool handles space-separated, comma-separated, or continuous binary input.",
            },
            {
              title: "Binary Code: The Language of Computers",
              content:
                "All digital computers operate using binary — a base-2 number system using only 0 and 1. These two states correspond directly to the on/off states of transistors in electronic circuits. Every piece of data stored on a computer, whether a document, image, or program, is ultimately represented as a sequence of binary digits. Understanding binary is fundamental to computer science, digital electronics, networking protocols, and low-level programming.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("binaryToText"); setInput(""); setOutput(""); setError(""); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
              mode === "binaryToText"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border border-[var(--border)] hover:bg-[var(--muted)]"
            }`}
          >
            Binary → Text
          </button>
          <button
            onClick={() => { setMode("textToBinary"); setInput(""); setOutput(""); setError(""); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
              mode === "textToBinary"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border border-[var(--border)] hover:bg-[var(--muted)]"
            }`}
          >
            Text → Binary
          </button>
        </div>

        {/* Options row */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">Delimiter:</label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as Delimiter)}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            >
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="none">None (continuous)</option>
            </select>
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {mode === "binaryToText" ? "Binary input" : "Text input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 resize-y"
            rows={5}
            spellCheck={false}
          />
        </div>

        <button
          onClick={handleConvert}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity btn-press"
        >
          Convert
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {mode === "binaryToText" ? "Text output" : "Binary output"}
              </span>
              <CopyButton text={output} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono whitespace-pre-wrap break-all text-[var(--foreground)]">
              {output}
            </pre>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
              <span>Characters: <strong className="text-[var(--foreground)]">{charCount}</strong></span>
              <span>Bits: <strong className="text-[var(--foreground)]">{bitCount}</strong></span>
              <span>Bytes: <strong className="text-[var(--foreground)]">{Math.ceil(bitCount / 8)}</strong></span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
