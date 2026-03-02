"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function hexToHsl(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));

  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface Palette {
  name: string;
  colors: string[];
}

function generatePalettes(baseHex: string): Palette[] {
  const [h, s, l] = hexToHsl(baseHex);

  return [
    {
      name: "Complementary",
      colors: [baseHex, hslToHex(h + 180, s, l)],
    },
    {
      name: "Analogous",
      colors: [hslToHex(h - 30, s, l), baseHex, hslToHex(h + 30, s, l)],
    },
    {
      name: "Triadic",
      colors: [baseHex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
    },
    {
      name: "Split-Complementary",
      colors: [baseHex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
    },
    {
      name: "Monochromatic",
      colors: [
        hslToHex(h, s, 90),
        hslToHex(h, s, 70),
        hslToHex(h, s, 50),
        hslToHex(h, s, 30),
        hslToHex(h, s, 10),
      ],
    },
  ];
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#2563eb");
  const [hexInput, setHexInput] = useState("#2563eb");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      setBaseColor(value);
    }
  };

  const handlePickerChange = (value: string) => {
    setBaseColor(value);
    setHexInput(value);
  };

  const copyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = hex;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const palettes = generatePalettes(baseColor);

  const allColors = palettes.flatMap((p) => p.colors);
  const uniqueColors = [...new Set(allColors)];
  const cssVarsOutput = uniqueColors
    .map((c, i) => `--color-${i + 1}: ${c};`)
    .join("\n");

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Generate color palettes from any base color. Create complementary, analogous, triadic, split-complementary, and monochromatic color schemes."
      slug="color-palette-generator"
    >
      {/* Color Input */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Base Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => handlePickerChange(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded border border-[var(--border)]"
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#2563eb"
            className="w-32 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>
      </div>

      {/* Palettes */}
      <div className="space-y-6">
        {palettes.map((palette) => (
          <div key={palette.name}>
            <label className="mb-2 block text-sm font-medium">{palette.name}</label>
            <div className="flex flex-wrap gap-3">
              {palette.colors.map((color, i) => (
                <button
                  key={`${palette.name}-${i}`}
                  onClick={() => copyColor(color)}
                  className="group flex flex-col items-center gap-1.5 btn-press"
                  title={`Click to copy ${color}`}
                >
                  <div
                    className="h-16 w-16 rounded-lg border border-[var(--border)] transition-transform group-hover:scale-105 sm:h-20 sm:w-20"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-[var(--muted-foreground)]">
                    {copiedColor === color ? "Copied!" : color}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CSS Variables Output */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">CSS Variables</span>
          <CopyButton text={cssVarsOutput} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
          {cssVarsOutput}
        </pre>
      </div>
    </ToolLayout>
  );
}
