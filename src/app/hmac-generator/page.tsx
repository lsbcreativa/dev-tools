"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

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

  const faqs = [
    { question: "What is the difference between HMAC and a regular hash?", answer: "A regular hash (SHA-256) only verifies data integrity \u2014 anyone can compute it. HMAC combines a secret key with the hash, providing both integrity verification AND authentication \u2014 only parties with the secret key can generate a valid HMAC." },
    { question: "Which HMAC algorithm should I use?", answer: "SHA-256 is the most common choice, offering a good balance of security and performance. SHA-384 and SHA-512 provide larger output and higher security margins. Use whatever your API or protocol specifies." },
    { question: "Is HMAC the same as digital signature?", answer: "No. HMAC uses symmetric keys \u2014 both parties share the same secret. Digital signatures use asymmetric keys (public/private) \u2014 only the signer has the private key. HMAC is simpler and faster but requires secure key exchange." },
  ];

  return (
    <ToolLayout
      title="HMAC Generator"
      description="Generate HMAC signatures using SHA-256, SHA-384, and SHA-512."
      slug="hmac-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Generate HMAC Signatures", content: "Enter your message and secret key, select a hash algorithm (SHA-256, SHA-384, or SHA-512), and generate an HMAC signature instantly. HMAC (Hash-based Message Authentication Code) combines a secret key with a hash function to produce a signature that verifies both data integrity and authenticity." },
            { title: "HMAC in API Authentication", content: "HMAC is widely used for API authentication and webhook verification. Services like AWS, Stripe, GitHub, and Shopify use HMAC signatures to verify that requests are authentic and haven't been tampered with. The sender computes an HMAC using the message body and a shared secret key, then includes the signature in the request header. The receiver recomputes the HMAC and compares it to the received signature." },
          ]}
          faqs={faqs}
        />
      }
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
