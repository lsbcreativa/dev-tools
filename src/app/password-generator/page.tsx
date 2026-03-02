"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:',.<>?/",
};

function generatePassword(
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): string {
  let charset = "";
  if (options.uppercase) charset += CHARSETS.uppercase;
  if (options.lowercase) charset += CHARSETS.lowercase;
  if (options.numbers) charset += CHARSETS.numbers;
  if (options.symbols) charset += CHARSETS.symbols;

  if (!charset) charset = CHARSETS.lowercase + CHARSETS.numbers;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (v) => charset[v % charset.length]).join("");
}

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (score <= 3) return { label: "Fair", color: "bg-yellow-500", width: "w-1/2" };
  if (score <= 4) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState(() =>
    generatePassword(16, { uppercase: true, lowercase: true, numbers: true, symbols: true })
  );

  const regenerate = useCallback(() => {
    setPassword(generatePassword(length, options));
  }, [length, options]);

  const strength = getStrength(password);

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure random passwords with customizable options."
      slug="password-generator"
      faqs={[
        { question: "How strong is a generated password?", answer: "Password strength depends on length and character variety. A 16-character password with uppercase, lowercase, numbers, and symbols has approximately 100 bits of entropy, making it practically impossible to brute-force with current technology." },
        { question: "Is it safe to generate passwords in a browser?", answer: "Yes. This tool runs entirely in your browser using the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers. No passwords are sent to any server or stored anywhere." },
        { question: "How long should my password be?", answer: "At minimum 12 characters, but 16 or more is recommended. Each additional character exponentially increases the number of possible combinations, making the password significantly harder to crack." }
      ]}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Generate a Secure Password", content: "Use the controls above to set your desired password length and character types. The generator uses the Web Crypto API for cryptographically secure randomness — the same standard used by password managers and security applications. Click generate to create a new password, then copy it directly to your clipboard." },
            { title: "What Makes a Password Strong?", content: "A strong password is long (16+ characters), uses a mix of character types (uppercase, lowercase, numbers, symbols), and is unique for each account. Avoid dictionary words, personal information, and common patterns like 123456 or qwerty. Using a unique random password for every account protects you even if one service is breached." }
          ]}
          faqs={[
            { question: "How strong is a generated password?", answer: "Password strength depends on length and character variety. A 16-character password with uppercase, lowercase, numbers, and symbols has approximately 100 bits of entropy, making it practically impossible to brute-force with current technology." },
            { question: "Is it safe to generate passwords in a browser?", answer: "Yes. This tool runs entirely in your browser using the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers. No passwords are sent to any server or stored anywhere." },
            { question: "How long should my password be?", answer: "At minimum 12 characters, but 16 or more is recommended. Each additional character exponentially increases the number of possible combinations, making the password significantly harder to crack." }
          ]}
        />
      }
    >
      <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
        <code className="flex-1 text-lg font-mono break-all">{password}</code>
        <CopyButton text={password} />
      </div>

      <div className="mt-3">
        <div className="h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
          <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
        </div>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Strength: <span className="font-medium">{strength.label}</span>
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 flex items-center justify-between text-sm font-medium">
            <span>Length: {length}</span>
          </label>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => {
              setLength(Number(e.target.value));
            }}
            className="w-full accent-[var(--primary)]"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(options) as (keyof typeof options)[]).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, [key]: e.target.checked }))
                }
                className="rounded accent-[var(--primary)]"
              />
              <span className="capitalize">{key}</span>
              <span className="text-xs text-[var(--muted-foreground)]">
                ({CHARSETS[key].slice(0, 6)}...)
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={regenerate}
          className="w-full rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Generate New Password
        </button>
      </div>
    </ToolLayout>
  );
}
