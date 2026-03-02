"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function nowTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

const DEFAULT_HEADER = JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2);

function defaultPayload(): string {
  const iat = nowTimestamp();
  return JSON.stringify(
    {
      sub: "1234567890",
      name: "John Doe",
      iat,
      exp: iat + 3600,
    },
    null,
    2
  );
}

export default function JwtBuilder() {
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [payload, setPayload] = useState(defaultPayload);
  const [secret, setSecret] = useState("your-secret-key");
  const [jwt, setJwt] = useState("");
  const [jwtParts, setJwtParts] = useState<string[]>([]);
  const [headerError, setHeaderError] = useState("");
  const [payloadError, setPayloadError] = useState("");
  const [signingError, setSigningError] = useState("");

  const signJwt = useCallback(async () => {
    setHeaderError("");
    setPayloadError("");
    setSigningError("");

    // Validate header JSON
    let headerObj;
    try {
      headerObj = JSON.parse(header);
    } catch {
      setHeaderError("Invalid JSON in header.");
      setJwt("");
      setJwtParts([]);
      return;
    }

    // Validate payload JSON
    let payloadObj;
    try {
      payloadObj = JSON.parse(payload);
    } catch {
      setPayloadError("Invalid JSON in payload.");
      setJwt("");
      setJwtParts([]);
      return;
    }

    try {
      const encodedHeader = base64UrlEncode(JSON.stringify(headerObj));
      const encodedPayload = base64UrlEncode(JSON.stringify(payloadObj));
      const signingInput = `${encodedHeader}.${encodedPayload}`;

      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(signingInput)
      );

      const encodedSignature = bufferToBase64Url(signature);
      const token = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

      setJwtParts([encodedHeader, encodedPayload, encodedSignature]);
      setJwt(token);
    } catch (err) {
      setSigningError(
        err instanceof Error ? err.message : "Failed to sign JWT"
      );
      setJwt("");
      setJwtParts([]);
    }
  }, [header, payload, secret]);

  useEffect(() => {
    signJwt();
  }, [signJwt]);

  const setIatToNow = () => {
    try {
      const obj = JSON.parse(payload);
      obj.iat = nowTimestamp();
      setPayload(JSON.stringify(obj, null, 2));
    } catch {
      // If payload is invalid JSON, don't do anything
    }
  };

  return (
    <ToolLayout
      title="JWT Builder"
      description="Build and sign JSON Web Tokens with HMAC-SHA256 using the Web Crypto API."
      slug="jwt-builder"
    >
      <div className="space-y-4">
        {/* Header editor */}
        <div>
          <label className="mb-1 block text-sm font-medium">Header</label>
          <textarea
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            rows={4}
            spellCheck={false}
          />
          {headerError && (
            <p className="mt-1 text-xs text-[var(--destructive)]">{headerError}</p>
          )}
        </div>

        {/* Payload editor */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Payload</label>
            <button
              onClick={setIatToNow}
              className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium transition-all hover:bg-[var(--muted)] btn-press"
            >
              Set iat to now
            </button>
          </div>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            rows={8}
            spellCheck={false}
          />
          {payloadError && (
            <p className="mt-1 text-xs text-[var(--destructive)]">{payloadError}</p>
          )}
        </div>

        {/* Secret key */}
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

        {/* Signing error */}
        {signingError && (
          <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
            {signingError}
          </div>
        )}

        {/* JWT Output */}
        {jwt && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Signed JWT</label>
              <CopyButton text={jwt} />
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono break-all leading-relaxed">
              <span style={{ color: "#ef4444" }}>{jwtParts[0]}</span>
              <span className="text-[var(--muted-foreground)]">.</span>
              <span style={{ color: "#a855f7" }}>{jwtParts[1]}</span>
              <span className="text-[var(--muted-foreground)]">.</span>
              <span style={{ color: "#06b6d4" }}>{jwtParts[2]}</span>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#ef4444" }} />
                Header
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#a855f7" }} />
                Payload
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#06b6d4" }} />
                Signature
              </span>
            </div>
          </div>
        )}

        <p className="text-xs text-[var(--muted-foreground)]">
          Base64URL encoding replaces + with -, / with _, and removes = padding.
          Signed using HMAC-SHA256 via the Web Crypto API.
        </p>
      </div>
    </ToolLayout>
  );
}
