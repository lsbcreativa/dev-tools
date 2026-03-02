"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

type Base = "decimal" | "binary" | "octal" | "hex";

const baseLabels: Record<Base, string> = {
  decimal: "Decimal",
  binary: "Binary",
  octal: "Octal",
  hex: "Hexadecimal",
};

function parseToBigInt(value: string, base: Base): bigint {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Empty input");

  switch (base) {
    case "decimal":
      if (!/^[0-9]+$/.test(trimmed)) throw new Error("Invalid decimal number.");
      return BigInt(trimmed);
    case "binary":
      if (!/^[01]+$/.test(trimmed)) throw new Error("Invalid binary number. Use only 0 and 1.");
      return BigInt("0b" + trimmed);
    case "octal":
      if (!/^[0-7]+$/.test(trimmed)) throw new Error("Invalid octal number. Use digits 0-7.");
      return BigInt("0o" + trimmed);
    case "hex":
      if (!/^[0-9a-fA-F]+$/.test(trimmed)) throw new Error("Invalid hexadecimal number. Use 0-9 and A-F.");
      return BigInt("0x" + trimmed);
  }
}

function formatFromBigInt(value: bigint): Record<Base, string> {
  return {
    decimal: value.toString(10),
    binary: value.toString(2),
    octal: value.toString(8),
    hex: value.toString(16).toUpperCase(),
  };
}

export default function NumberBaseConverterTool() {
  const [input, setInput] = useState("");
  const [inputBase, setInputBase] = useState<Base>("decimal");

  const result = useMemo(() => {
    if (!input.trim()) return { values: null, error: "" };
    try {
      const num = parseToBigInt(input, inputBase);
      if (num < BigInt(0)) return { values: null, error: "Negative numbers are not supported." };
      return { values: formatFromBigInt(num), error: "" };
    } catch (e) {
      return {
        values: null,
        error: e instanceof Error ? e.message : "Invalid input for the selected base.",
      };
    }
  }, [input, inputBase]);

  const faqs = [
    {
      question: "Why do programmers use hexadecimal?",
      answer: "Hexadecimal is compact \u2014 each hex digit represents exactly 4 binary bits. This makes it ideal for representing memory addresses, color codes (#RRGGBB), byte values (0x00-0xFF), and other binary data in a human-readable format.",
    },
    {
      question: "What is octal used for?",
      answer: "Octal is primarily used for Unix/Linux file permissions (e.g., chmod 755). Each octal digit represents 3 permission bits: read (4), write (2), and execute (1). It's also used in some programming contexts for character escape sequences.",
    },
    {
      question: "Can I convert negative numbers?",
      answer: "This tool converts unsigned integers. Negative numbers in binary use representations like two's complement, which depends on the bit width (8-bit, 16-bit, 32-bit, 64-bit).",
    },
  ];

  return (
    <ToolLayout
      title="Number Base Converter"
      description="Convert numbers between decimal, binary, octal, and hexadecimal. Supports large numbers."
      slug="number-base-converter"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert Number Bases",
              content: "Enter a number in any base \u2014 decimal (base 10), binary (base 2), octal (base 8), or hexadecimal (base 16) \u2014 and see instant conversions to all other bases. The tool validates your input against the selected base and shows the equivalent value in each number system. It handles both integers and common programming prefixes like 0x for hex and 0b for binary.",
            },
            {
              title: "Understanding Number Systems in Programming",
              content: "Computers operate in binary (base 2), using only 0s and 1s. Hexadecimal (base 16) is a compact way to represent binary data \u2014 each hex digit maps to exactly 4 binary digits. Octal (base 8) maps to 3 binary digits and was historically used in Unix file permissions (chmod 755). Decimal (base 10) is the human-readable format. Developers regularly convert between these bases when working with memory addresses, color codes (#FF5733), bitwise operations, and network protocols.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Input Number</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              inputBase === "decimal" ? "e.g. 255"
              : inputBase === "binary" ? "e.g. 11111111"
              : inputBase === "octal" ? "e.g. 377"
              : "e.g. FF"
            }
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Input Base</label>
          <select
            value={inputBase}
            onChange={(e) => setInputBase(e.target.value as Base)}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm"
          >
            <option value="decimal">Decimal (10)</option>
            <option value="binary">Binary (2)</option>
            <option value="octal">Octal (8)</option>
            <option value="hex">Hexadecimal (16)</option>
          </select>
        </div>
      </div>

      {result.error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {result.error}
        </div>
      )}

      {result.values && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(baseLabels) as Base[]).map((base) => (
            <div
              key={base}
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  {baseLabels[base]}
                </span>
                <CopyButton text={result.values![base]} />
              </div>
              <p className="text-sm font-mono break-all">{result.values![base]}</p>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
