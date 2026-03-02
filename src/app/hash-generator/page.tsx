"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

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

  const faqs = [
    { question: "Which hash algorithm should I use?", answer: "Use SHA-256 for security-critical applications (password hashing, digital signatures, data integrity). MD5 is acceptable for non-security checksums like file verification. Never use MD5 or SHA-1 for passwords or security." },
    { question: "Can two different inputs produce the same hash?", answer: "In theory, yes \u2014 this is called a collision. MD5 and SHA-1 have known collision vulnerabilities. SHA-256 has no known practical collisions and is considered collision-resistant for all practical purposes." },
    { question: "Is hashing the same as encryption?", answer: "No. Hashing is one-way \u2014 you cannot reverse a hash to get the original data. Encryption is two-way \u2014 encrypted data can be decrypted with the correct key. Hashing is used for verification, encryption for confidentiality." },
  ];

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes from any text."
      slug="hash-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Generate Hash Values", content: "Enter any text and instantly generate cryptographic hash values in multiple algorithms: MD5, SHA-1, SHA-256, and SHA-512. Hash functions convert input of any length into a fixed-length string of characters. Even a tiny change in the input produces a completely different hash, making them useful for data integrity verification." },
            { title: "Understanding Cryptographic Hash Functions", content: "Cryptographic hash functions are one-way mathematical operations \u2014 you can compute a hash from data, but you cannot reverse it to get the original data. MD5 (128-bit) and SHA-1 (160-bit) are considered broken for security purposes but still used for checksums. SHA-256 and SHA-512 are secure and used in SSL certificates, blockchain, password storage, and digital signatures. All hashes are generated client-side using the Web Crypto API." },
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
