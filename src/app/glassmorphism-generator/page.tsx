"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function hexToRgba(hex: string, opacity: number): string {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(25);
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderOpacity, setBorderOpacity] = useState(30);
  const [borderRadius, setBorderRadius] = useState(16);
  const [bgColor, setBgColor] = useState("#ffffff");

  const backgroundRgba = hexToRgba(bgColor, opacity);
  const borderRgba = hexToRgba("#ffffff", borderOpacity);

  const cssOutput = `background: ${backgroundRgba};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: ${borderWidth}px solid ${borderRgba};
border-radius: ${borderRadius}px;`;

  return (
    <ToolLayout
      title="Glassmorphism Generator"
      description="Create beautiful glassmorphism CSS effects with a live preview. Adjust blur, transparency, border, and more."
      slug="glassmorphism-generator"
    >
      {/* Preview */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Preview</label>
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-lg border border-[var(--border)]"
          style={{ minHeight: 300 }}
        >
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%)",
            }}
          />
          {/* Decorative shapes */}
          <div
            className="absolute"
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "#ff6b6b",
              top: "10%",
              left: "10%",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "#4ecdc4",
              bottom: "10%",
              right: "15%",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "#ffe66d",
              top: "30%",
              right: "25%",
              opacity: 0.6,
            }}
          />

          {/* Glass card */}
          <div
            className="relative z-10 flex flex-col items-center justify-center p-8"
            style={{
              width: 280,
              height: 180,
              background: backgroundRgba,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              border: `${borderWidth}px solid ${borderRgba}`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <p
              className="text-lg font-semibold"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Glass Card
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Glassmorphism effect
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Blur */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Blur</label>
            <span className="text-xs text-[var(--muted-foreground)] font-mono">
              {blur}px
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Transparency / Opacity */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Transparency</label>
            <span className="text-xs text-[var(--muted-foreground)] font-mono">
              {opacity}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Border Width */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Border Width</label>
            <span className="text-xs text-[var(--muted-foreground)] font-mono">
              {borderWidth}px
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.5}
            value={borderWidth}
            onChange={(e) => setBorderWidth(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Border Opacity */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Border Opacity</label>
            <span className="text-xs text-[var(--muted-foreground)] font-mono">
              {borderOpacity}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={borderOpacity}
            onChange={(e) => setBorderOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Border Radius */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Border Radius</label>
            <span className="text-xs text-[var(--muted-foreground)] font-mono">
              {borderRadius}px
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-28 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">CSS Output</span>
          <CopyButton text={cssOutput} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          {cssOutput}
        </pre>
      </div>
    </ToolLayout>
  );
}
