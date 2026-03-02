"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
}

function base64UrlDecode(str: string): string {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export default function JwtDecoderTool() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState("");

  const handleDecode = () => {
    setError("");
    setDecoded(null);

    const token = input.trim();
    if (!token) {
      setError("Please enter a JWT token.");
      return;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT format. A JWT should have 3 parts separated by dots.");
      return;
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      setDecoded({ header, payload });
    } catch {
      setError("Failed to decode JWT. Make sure the token is valid.");
    }
  };

  const getExpirationBadge = () => {
    if (!decoded) return null;
    const exp = decoded.payload.exp as number | undefined;

    if (exp === undefined) {
      return (
        <span className="inline-flex items-center rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
          No expiration
        </span>
      );
    }

    const now = Date.now() / 1000;
    if (exp > now) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
          Valid — expires {formatDate(exp)}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-600">
        Expired — {formatDate(exp)}
      </span>
    );
  };

  const headerStr = decoded ? JSON.stringify(decoded.header, null, 2) : "";
  const payloadStr = decoded ? JSON.stringify(decoded.payload, null, 2) : "";

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens. View the header, payload, and expiration status."
      slug="jwt-decoder"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">JWT Token</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT token here (eyJhbGciOiJIUzI1NiIs...)"
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={4}
        />
      </div>

      <button
        onClick={handleDecode}
        className="mt-3 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
      >
        Decode
      </button>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {decoded && (
        <div className="mt-4 space-y-4">
          {/* Expiration badge */}
          <div className="flex items-center gap-3">
            {getExpirationBadge()}
            {decoded.payload.iat !== undefined && (
              <span className="text-xs text-[var(--muted-foreground)]">
                Issued at: {formatDate(decoded.payload.iat as number)}
              </span>
            )}
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Header</span>
              <CopyButton text={headerStr} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
              {headerStr}
            </pre>
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Payload</span>
              <CopyButton text={payloadStr} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
              {payloadStr}
            </pre>
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            This tool decodes JWTs but does not verify signatures.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
