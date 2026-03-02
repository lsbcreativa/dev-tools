"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- Color math helpers ---------- */

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

function linearize(channel: number): number {
  const sRGB = channel / 255;
  return sRGB <= 0.03928
    ? sRGB / 12.92
    : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

/* ---------- Badge component ---------- */

function ResultBadge({
  label,
  pass,
  threshold,
}: {
  label: string;
  pass: boolean;
  threshold: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-[var(--muted-foreground)]">
          Requires {threshold}
        </div>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          pass
            ? "bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30"
            : "bg-[var(--destructive)]/15 text-[var(--destructive)] border border-[var(--destructive)]/30"
        }`}
      >
        {pass ? "PASS" : "FAIL"}
      </span>
    </div>
  );
}

/* ---------- Component ---------- */

export default function ContrastCheckerPage() {
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [fgInput, setFgInput] = useState("#000000");
  const [bgInput, setBgInput] = useState("#ffffff");

  const validFg = isValidHex(fgInput);
  const validBg = isValidHex(bgInput);

  const activeFg = validFg ? fgInput : foreground;
  const activeBg = validBg ? bgInput : background;

  const ratio = useMemo(
    () => contrastRatio(activeFg, activeBg),
    [activeFg, activeBg]
  );

  const ratioText = `${ratio.toFixed(2)} : 1`;

  const handleFgTextChange = (val: string) => {
    // Auto-add # if missing
    if (val && !val.startsWith("#")) val = "#" + val;
    setFgInput(val);
    if (isValidHex(val)) setForeground(val);
  };

  const handleBgTextChange = (val: string) => {
    if (val && !val.startsWith("#")) val = "#" + val;
    setBgInput(val);
    if (isValidHex(val)) setBackground(val);
  };

  const handleFgPickerChange = (val: string) => {
    setForeground(val);
    setFgInput(val);
  };

  const handleBgPickerChange = (val: string) => {
    setBackground(val);
    setBgInput(val);
  };

  const swapColors = () => {
    setForeground(activeBg);
    setBackground(activeFg);
    setFgInput(activeBg);
    setBgInput(activeFg);
  };

  return (
    <ToolLayout
      title="Color Contrast Checker"
      description="Check WCAG 2.0 color contrast ratios between foreground and background colors for accessibility compliance."
      slug="contrast-checker"
    >
      {/* Color inputs */}
      <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] items-end">
        {/* Foreground */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Foreground / Text Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => handleFgPickerChange(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-md border border-[var(--border)]"
            />
            <input
              type="text"
              value={fgInput}
              onChange={(e) => handleFgTextChange(e.target.value)}
              maxLength={7}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-mono ${
                validFg
                  ? "border-[var(--border)]"
                  : "border-[var(--destructive)]"
              }`}
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Swap button */}
        <div className="flex items-center justify-center pb-1">
          <button
            onClick={swapColors}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            title="Swap colors"
          >
            &#8596;
          </button>
        </div>

        {/* Background */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => handleBgPickerChange(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-md border border-[var(--border)]"
            />
            <input
              type="text"
              value={bgInput}
              onChange={(e) => handleBgTextChange(e.target.value)}
              maxLength={7}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-mono ${
                validBg
                  ? "border-[var(--border)]"
                  : "border-[var(--destructive)]"
              }`}
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Contrast ratio display */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="text-xs text-[var(--muted-foreground)]">
          Contrast Ratio
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tabular-nums">{ratioText}</span>
          <CopyButton text={ratioText} label="Copy" />
        </div>
      </div>

      {/* Preview */}
      <div
        className="mt-6 rounded-lg border border-[var(--border)] p-6"
        style={{ backgroundColor: activeBg }}
      >
        <p
          className="text-2xl font-bold leading-relaxed"
          style={{ color: activeFg }}
        >
          Large Text Preview (24px bold)
        </p>
        <p className="mt-2 text-base" style={{ color: activeFg }}>
          Normal text preview. The quick brown fox jumps over the lazy dog.
          Ensure your text remains readable across different screen sizes and
          viewing conditions.
        </p>
        <p className="mt-2 text-sm" style={{ color: activeFg }}>
          Small text preview (14px) - check if this is still comfortable to
          read.
        </p>
      </div>

      {/* WCAG Results */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ResultBadge
          label="AA Normal Text"
          pass={ratio >= 4.5}
          threshold="4.5 : 1"
        />
        <ResultBadge
          label="AA Large Text"
          pass={ratio >= 3}
          threshold="3 : 1"
        />
        <ResultBadge
          label="AAA Normal Text"
          pass={ratio >= 7}
          threshold="7 : 1"
        />
        <ResultBadge
          label="AAA Large Text"
          pass={ratio >= 4.5}
          threshold="4.5 : 1"
        />
      </div>

      {/* Info */}
      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
        <h3 className="mb-2 text-sm font-medium">About WCAG Contrast</h3>
        <div className="space-y-1 text-xs text-[var(--muted-foreground)]">
          <p>
            <strong>AA Normal Text:</strong> Requires at least 4.5:1 contrast
            ratio for text smaller than 18pt (or 14pt bold).
          </p>
          <p>
            <strong>AA Large Text:</strong> Requires at least 3:1 for text 18pt+
            or 14pt+ bold.
          </p>
          <p>
            <strong>AAA Normal Text:</strong> Enhanced contrast of 7:1 for
            normal text.
          </p>
          <p>
            <strong>AAA Large Text:</strong> Enhanced contrast of 4.5:1 for
            large text.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
