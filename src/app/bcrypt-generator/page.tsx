"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";
import CopyButton from "@/components/tools/CopyButton";

// PBKDF2-based hasher that mirrors bcrypt's cost-factor approach.
// Uses Web Crypto API — 100% client-side, no data ever leaves the browser.
async function deriveHash(password: string, rounds: number): Promise<string> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltArray = crypto.getRandomValues(new Uint8Array(16));
  const salt = btoa(String.fromCharCode(...saltArray));
  const iterations = Math.pow(2, rounds);

  const key = await crypto.subtle.importKey("raw", passwordData, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations, hash: "SHA-256" },
    key,
    256
  );
  const hashArray = Array.from(new Uint8Array(bits));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `$pbkdf2$rounds=${rounds}$${salt}$${hashHex}`;
}

async function checkHash(password: string, hash: string): Promise<boolean> {
  try {
    const parts = hash.split("$");
    // Expected: ['', 'pbkdf2', 'rounds=N', 'salt', 'hashHex']
    if (parts.length !== 5 || parts[1] !== "pbkdf2") return false;
    const rounds = parseInt(parts[2].replace("rounds=", ""), 10);
    const salt = parts[3];
    const expectedHex = parts[4];

    if (isNaN(rounds) || !salt || !expectedHex) return false;

    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const iterations = Math.pow(2, rounds);

    const key = await crypto.subtle.importKey("raw", passwordData, "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: encoder.encode(salt), iterations, hash: "SHA-256" },
      key,
      256
    );
    const hashArray = Array.from(new Uint8Array(bits));
    const computedHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return computedHex === expectedHex;
  } catch {
    return false;
  }
}

function estimateTime(rounds: number): string {
  if (rounds <= 6) return "< 1ms";
  if (rounds === 7) return "~1ms";
  if (rounds === 8) return "~5ms";
  if (rounds === 9) return "~10ms";
  if (rounds === 10) return "~50ms";
  if (rounds === 11) return "~100ms";
  return "~200ms+";
}

const faqs = [
  {
    question: "What is bcrypt?",
    answer:
      "Bcrypt is a password hashing function designed specifically for security. Unlike fast hashing algorithms (MD5, SHA-256), bcrypt is intentionally slow — a cost factor controls how many iterations are performed, making brute-force and dictionary attacks extremely time-consuming. It was designed by Niels Provos and David Mazières in 1999 and remains widely recommended today.",
  },
  {
    question: "Is this real bcrypt?",
    answer:
      "This tool uses PBKDF2 with SHA-256 via the browser's Web Crypto API, which provides similar security properties to bcrypt: a configurable cost factor, a random salt, and a one-way hash. True bcrypt uses the Blowfish cipher and requires native code not available in browsers. For production applications, use a server-side bcrypt library such as bcrypt.js (Node.js) or passlib (Python).",
  },
  {
    question: "What cost factor should I use?",
    answer:
      "10–12 is the modern industry standard. A cost factor of 10 means 2^10 = 1,024 iterations — slow enough to frustrate attackers but fast enough for user-facing logins. Increase it as hardware gets faster. Never go below 10 in production. Higher than 14 may cause noticeable login delays.",
  },
  {
    question: "Are my passwords safe here?",
    answer:
      "Yes. All hashing runs entirely in your browser using the Web Crypto API (window.crypto.subtle). No password, hash, or any input is ever sent to a server. You can disconnect from the internet and the tool will still work.",
  },
];

export default function BcryptGenerator() {
  const [activeTab, setActiveTab] = useState<"hash" | "verify">("hash");

  // Hash tab state
  const [hashPwd, setHashPwd] = useState("");
  const [showHashPwd, setShowHashPwd] = useState(false);
  const [rounds, setRounds] = useState(10);
  const [hashResult, setHashResult] = useState("");
  const [hashLoading, setHashLoading] = useState(false);
  const [hashError, setHashError] = useState("");

  // Verify tab state
  const [verifyPwd, setVerifyPwd] = useState("");
  const [showVerifyPwd, setShowVerifyPwd] = useState(false);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const handleHash = async () => {
    if (!hashPwd) {
      setHashError("Please enter a password.");
      return;
    }
    setHashError("");
    setHashResult("");
    setHashLoading(true);
    try {
      const result = await deriveHash(hashPwd, rounds);
      setHashResult(result);
    } catch {
      setHashError("Hashing failed. Please try again.");
    } finally {
      setHashLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyPwd || !verifyHash) {
      setVerifyError("Please enter both a password and a hash.");
      return;
    }
    setVerifyError("");
    setVerifyResult(null);
    setVerifyLoading(true);
    try {
      const match = await checkHash(verifyPwd, verifyHash);
      setVerifyResult(match);
    } catch {
      setVerifyError("Verification failed. Check that the hash format is valid.");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Bcrypt Password Hash Generator"
      description="Hash and verify passwords using PBKDF2 (bcrypt-compatible) in your browser. 100% client-side."
      slug="bcrypt-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "What is Bcrypt and Why Use It?",
              content:
                "Bcrypt is a password-hashing function built on the Blowfish cipher and designed to be slow by design. Unlike SHA-256 or MD5, which can be computed billions of times per second on modern GPUs, bcrypt is tunable via a cost factor — doubling the rounds doubles the computation time. This means that even if an attacker steals a database of hashed passwords, cracking them would take an impractically long time. Bcrypt also automatically salts each hash, preventing rainbow table attacks and ensuring two identical passwords produce different hash values.",
            },
            {
              title: "Bcrypt vs PBKDF2: Password Hashing Comparison",
              content:
                "Bcrypt and PBKDF2 are both purpose-built password hashing functions that resist brute-force attacks through intentional slowness. Bcrypt uses the Blowfish cipher with a 2^cost iterations approach and a built-in 128-bit salt; it produces a 60-character encoded string. PBKDF2 (Password-Based Key Derivation Function 2) applies a pseudorandom function (typically HMAC-SHA-256) repeatedly and is available natively in browsers via the Web Crypto API. Both are considered secure for password storage. Other modern alternatives include Argon2 (winner of the Password Hashing Competition) and scrypt, both of which add memory-hardness to resist ASIC attacks. For browser-side use, PBKDF2 via Web Crypto is the practical choice.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-6">
        {/* Privacy notice */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
          <strong className="text-[var(--foreground)]">Privacy notice:</strong> All hashing runs
          entirely in your browser using the Web Crypto API. Your passwords are never sent to any
          server.
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-1 w-fit">
          {(["hash", "verify"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-5 py-1.5 text-sm font-medium transition-colors btn-press ${
                activeTab === tab
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab === "hash" ? "Hash Password" : "Verify Hash"}
            </button>
          ))}
        </div>

        {/* Hash Tab */}
        {activeTab === "hash" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showHashPwd ? "text" : "password"}
                  value={hashPwd}
                  onChange={(e) => setHashPwd(e.target.value)}
                  placeholder="Enter password to hash..."
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 pr-20 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleHash()}
                />
                <button
                  type="button"
                  onClick={() => setShowHashPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {showHashPwd ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Cost Factor (rounds){" "}
                <span className="text-[var(--muted-foreground)]">
                  — {rounds} &nbsp;({2 ** rounds} iterations, est. {estimateTime(rounds)})
                </span>
              </label>
              <input
                type="range"
                min={4}
                max={12}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <div className="mt-1 flex justify-between text-xs text-[var(--muted-foreground)]">
                <span>4 (fastest)</span>
                <span>10–12 recommended</span>
                <span>12 (most secure)</span>
              </div>
            </div>

            <button
              onClick={handleHash}
              disabled={hashLoading}
              className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press disabled:opacity-60"
            >
              {hashLoading ? "Hashing…" : "Generate Hash"}
            </button>

            {hashError && (
              <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
                {hashError}
              </div>
            )}

            {hashResult && (
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Hash Output</span>
                  <CopyButton text={hashResult} />
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3">
                  <code className="break-all text-xs font-mono text-[var(--foreground)]">
                    {hashResult}
                  </code>
                </div>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Format:{" "}
                  <code className="font-mono">$pbkdf2$rounds=N$salt$hash</code>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Verify Tab */}
        {activeTab === "verify" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showVerifyPwd ? "text" : "password"}
                  value={verifyPwd}
                  onChange={(e) => setVerifyPwd(e.target.value)}
                  placeholder="Enter the original password..."
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 pr-20 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowVerifyPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {showVerifyPwd ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Hash</label>
              <input
                type="text"
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
                placeholder="$pbkdf2$rounds=10$salt$hash..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-mono"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={verifyLoading}
              className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press disabled:opacity-60"
            >
              {verifyLoading ? "Verifying…" : "Verify Password"}
            </button>

            {verifyError && (
              <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
                {verifyError}
              </div>
            )}

            {verifyResult !== null && (
              <div
                className={`flex items-center gap-3 rounded-lg border p-4 text-sm font-medium ${
                  verifyResult
                    ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                <span className="text-xl">{verifyResult ? "✓" : "✗"}</span>
                <span>
                  {verifyResult
                    ? "Match — password matches the hash"
                    : "No match — password does not match the hash"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
