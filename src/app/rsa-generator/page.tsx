"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function formatPem(base64: string, label: string): string {
  const lines: string[] = [];
  lines.push(`-----BEGIN ${label}-----`);
  for (let i = 0; i < base64.length; i += 64) {
    lines.push(base64.slice(i, i + 64));
  }
  lines.push(`-----END ${label}-----`);
  return lines.join("\n");
}

export default function RSAKeyPairGenerator() {
  const [keySize, setKeySize] = useState<2048 | 4096>(2048);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateKeys = async () => {
    setLoading(true);
    setError("");
    setPublicKey("");
    setPrivateKey("");

    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      const spkiBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
      const pkcs8Buffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const pubB64 = arrayBufferToBase64(spkiBuffer);
      const privB64 = arrayBufferToBase64(pkcs8Buffer);

      setPublicKey(formatPem(pubB64, "PUBLIC KEY"));
      setPrivateKey(formatPem(privB64, "PRIVATE KEY"));
    } catch (e) {
      setError(
        `Failed to generate keys: ${(e as Error).message}. Make sure your browser supports the Web Crypto API.`
      );
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { question: "Should I use 2048 or 4096 bit keys?", answer: "2048-bit keys are considered secure until at least 2030 and are faster for encryption/decryption. 4096-bit keys provide higher security margins but are slower. Use 2048 for most applications and 4096 for high-security requirements." },
    { question: "Are the generated keys secure?", answer: "Yes. Keys are generated using the Web Crypto API, which uses cryptographically secure random number generation built into your browser. No keys are transmitted to any server." },
    { question: "What is the difference between public and private keys?", answer: "The public key encrypts data and verifies signatures \u2014 share it freely. The private key decrypts data and creates signatures \u2014 keep it secret. Anyone with your public key can send you encrypted messages, but only your private key can decrypt them." },
  ];

  return (
    <ToolLayout
      title="RSA Key Pair Generator"
      description="Generate RSA public and private key pairs using the Web Crypto API. All processing happens in your browser."
      slug="rsa-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Generate RSA Key Pairs", content: "Click Generate to create a new RSA key pair using the Web Crypto API. The tool produces a public key and a private key in PEM format (Base64-encoded PKCS#8/SPKI). Choose your key size (2048 or 4096 bits) based on your security requirements. Copy each key individually or download them as files." },
            { title: "Understanding RSA Key Pairs", content: "RSA (Rivest-Shamir-Adleman) is an asymmetric encryption algorithm that uses a pair of mathematically linked keys. The public key encrypts data and can be shared freely. The private key decrypts data and must be kept secret. RSA is used for HTTPS/SSL certificates, SSH authentication, email encryption (PGP/GPG), digital signatures, and JWT signing. Key generation uses your browser's Web Crypto API \u2014 private keys never leave your device." },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Warning banner */}
      <div className="rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/10 p-3 text-sm text-[var(--success)] mb-4">
        These keys are generated in your browser and never leave your device.
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Key Size</label>
          <select
            value={keySize}
            onChange={(e) => setKeySize(Number(e.target.value) as 2048 | 4096)}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-transparent"
          >
            <option value={2048}>2048 bit</option>
            <option value={4096}>4096 bit</option>
          </select>
        </div>

        <button
          onClick={generateKeys}
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:opacity-50 btn-press"
        >
          {loading ? "Generating..." : "Generate Key Pair"}
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generating {keySize}-bit RSA key pair... {keySize === 4096 && "This may take a moment."}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Public Key */}
      {publicKey && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Public Key (SPKI, PEM)</span>
            <CopyButton text={publicKey} />
          </div>
          <textarea
            readOnly
            value={publicKey}
            rows={8}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs font-mono resize-none"
          />
        </div>
      )}

      {/* Private Key */}
      {privateKey && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">
              Private Key (PKCS8, PEM)
            </span>
            <CopyButton text={privateKey} />
          </div>
          <textarea
            readOnly
            value={privateKey}
            rows={14}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs font-mono resize-none"
          />
        </div>
      )}
    </ToolLayout>
  );
}
