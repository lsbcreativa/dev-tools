"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const PRESETS = [
  { name: "Tailwind Blue", colors: ["#dbeafe", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"] },
  { name: "Tailwind Green", colors: ["#dcfce7", "#86efac", "#22c55e", "#15803d", "#14532d"] },
  { name: "Tailwind Purple", colors: ["#f3e8ff", "#c084fc", "#a855f7", "#7e22ce", "#581c87"] },
  { name: "Tailwind Red", colors: ["#fee2e2", "#fca5a5", "#ef4444", "#b91c1c", "#7f1d1d"] },
  { name: "Tailwind Amber", colors: ["#fef3c7", "#fcd34d", "#f59e0b", "#b45309", "#78350f"] },
  { name: "Neutrals", colors: ["#f5f5f5", "#a3a3a3", "#737373", "#404040", "#171717"] },
];

export default function ColorPicker() {
  const [hex, setHex] = useState("#2563eb");

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const handleHexInput = useCallback((value: string) => {
    const v = value.startsWith("#") ? value : "#" + value;
    setHex(v);
  }, []);

  const handleRgbChange = useCallback((component: "r" | "g" | "b", value: number) => {
    if (!rgb) return;
    const updated = { ...rgb, [component]: Math.max(0, Math.min(255, value)) };
    setHex(rgbToHex(updated.r, updated.g, updated.b));
  }, [rgb]);

  const hexValue = hex.toUpperCase();
  const rgbValue = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
  const hslValue = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "";

  const faqs = [
    {
      question: "What is the difference between HEX and RGB?",
      answer: "They represent the same color information differently. HEX uses hexadecimal notation (#FF5733), RGB uses decimal values (rgb(255, 87, 51)). HEX is more compact, RGB is easier to read and modify programmatically. Both produce identical colors.",
    },
    {
      question: "When should I use HSL instead of HEX?",
      answer: "HSL is intuitive for creating color variations — change lightness for light/dark variants, saturation for vibrancy, or hue for color shifts. It's ideal for generating color palettes and design systems where you need systematic color relationships.",
    },
    {
      question: "How do I make a color semi-transparent?",
      answer: "Use RGBA (rgba(255, 87, 51, 0.5)) or HSLA (hsla(11, 100%, 60%, 0.5)) where the fourth value is opacity (0 = transparent, 1 = opaque). In modern CSS, you can also use #FF573380 (8-digit hex with alpha).",
    },
  ];

  return (
    <ToolLayout
      title="Color Picker & Converter"
      description="Pick colors and convert between HEX, RGB, and HSL formats."
      slug="color-picker"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Pick and Convert Colors",
              content: "Use the color picker to select any color visually, or enter a value in HEX, RGB, or HSL format. The tool instantly converts between all three formats and shows the CSS color values ready to copy. Adjust hue, saturation, and lightness individually to fine-tune your selection.",
            },
            {
              title: "Understanding Color Formats in CSS",
              content: "HEX (#FF5733) is the most common CSS color format — a six-digit hexadecimal representation of red, green, and blue channels. RGB (rgb(255, 87, 51)) specifies color using decimal values from 0-255 for each channel. HSL (hsl(11, 100%, 60%)) uses hue (0-360°), saturation (0-100%), and lightness (0-100%), making it intuitive for adjusting colors. Modern CSS also supports OKLCH and color() functions for wider gamut colors.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <div
            className="h-48 w-full rounded-xl border border-[var(--border)] shadow-inner transition-colors"
            style={{ backgroundColor: hex }}
          />
          <input
            type="color"
            value={hex.length === 7 ? hex : "#2563eb"}
            onChange={(e) => setHex(e.target.value)}
            className="mt-3 h-10 w-full cursor-pointer rounded-lg border border-[var(--border)]"
          />
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">HEX</label>
            <div className="flex gap-2">
              <input
                value={hex}
                onChange={(e) => handleHexInput(e.target.value)}
                className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                maxLength={7}
              />
              <CopyButton text={hexValue} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">RGB</label>
            <div className="flex gap-2">
              <div className="flex flex-1 gap-1">
                {rgb && (["r", "g", "b"] as const).map((c) => (
                  <input
                    key={c}
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[c]}
                    onChange={(e) => handleRgbChange(c, parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-[var(--border)] px-2 py-2 text-sm font-mono text-center"
                  />
                ))}
              </div>
              <CopyButton text={rgbValue} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">HSL</label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-mono">
                {hslValue}
              </div>
              <CopyButton text={hslValue} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">CSS Variable</label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-mono truncate">
                --color: {hexValue};
              </div>
              <CopyButton text={`--color: ${hexValue};`} />
            </div>
          </div>
        </div>
      </div>

      {/* Color presets */}
      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <h3 className="mb-3 text-sm font-semibold">Color Presets</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => (
            <div key={preset.name} className="rounded-lg border border-[var(--border)] p-3">
              <div className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">{preset.name}</div>
              <div className="flex gap-1">
                {preset.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setHex(color)}
                    className="h-8 flex-1 rounded-md border border-[var(--border)] transition-transform hover:scale-110 btn-press"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
