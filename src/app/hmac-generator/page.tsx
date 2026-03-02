"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

const ALGORITHMS = [
  { label: "HMAC-SHA256", hash: "SHA-256" },
  { label: "HMAC-SHA384", hash: "SHA-384" },
  { label: "HMAC-SHA512", hash: "SHA-512" },
];

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function HmacGenerator() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState(ALGORITHMS[0]);
  const [hexDigest, setHexDigest] = useState("");
  const [base64Digest, setBase64Digest] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      if (!message || !secret) {
        setHexDigest("");
        setBase64Digest("");
        setError("");
        return;
      }

      try {
        const encoder = new TextEncoder();
        const encodedKey = encoder.encode(secret);
        const encodedMessage = encoder.encode(message);

        const key = await crypto.subtle.importKey(
          "raw",
          encodedKey,
          { name: "HMAC", hash: algorithm.hash },
          false,
          ["sign"]
        );

        const sig = await crypto.subtle.sign("HMAC", key, encodedMessage);

        if (!cancelled) {
          setHexDigest(bufferToHex(sig));
          setBase64Digest(bufferToBase64(sig));
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to generate HMAC"
          );
          setHexDigest("");
          setBase64Digest("");
        }
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [message, secret, algorithm]);

  return (
    <ToolLayout
      title="HMAC Generator"
      description="Generate HMAC signatures using SHA-256, SHA-384, and SHA-512."
      slug="hmac-generator"
    >
      <div className="space-y-4">
        {/* Info banner */}
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-400">
          Generated using Web Crypto API. Your data never leaves your browser.
        </div>

        {/* Message input */}
        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message to sign..."
            className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            rows={4}
          />
        </div>

        {/* Secret key input */}
        <div>
          <label className="mb-1 block text-sm font-medium">Secret Key</label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret key..."
            className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
          />
        </div>

        {/* Algorithm select */}
        <div>
          <label className="mb-1 block text-sm font-medium">Algorithm</label>
          <select
            value={algorithm.label}
            onChange={(e) => {
              const found = ALGORITHMS.find((a) => a.label === e.target.value);
              if (found) setAlgorithm(found);
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo.label} value={algo.label}>
                {algo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
            {error}
          </div>
        )}

        {/* Outputs */}
        {hexDigest && (
          <div className="space-y-4">
            {/* Hex digest */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Hex Digest</span>
                <CopyButton text={hexDigest} />
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs font-mono break-all">
                {hexDigest}
              </div>
            </div>

            {/* Base64 digest */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Base64 Digest</span>
                <CopyButton text={base64Digest} />
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs font-mono break-all">
                {base64Digest}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
