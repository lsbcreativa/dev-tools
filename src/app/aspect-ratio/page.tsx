"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

const commonRatios = [
  { label: "16:9", w: 1920, h: 1080 },
  { label: "4:3", w: 1024, h: 768 },
  { label: "1:1", w: 1000, h: 1000 },
  { label: "21:9", w: 2560, h: 1080 },
  { label: "3:2", w: 1500, h: 1000 },
  { label: "9:16", w: 1080, h: 1920 },
];

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [newWidth, setNewWidth] = useState<string>("");
  const [newHeight, setNewHeight] = useState<string>("");

  const ratio = useMemo(() => {
    if (!width || !height || width <= 0 || height <= 0) return null;
    const d = gcd(width, height);
    const rw = width / d;
    const rh = height / d;
    return {
      simplified: `${rw}:${rh}`,
      decimal: (width / height).toFixed(4),
      rw,
      rh,
    };
  }, [width, height]);

  const cssValue = ratio ? `aspect-ratio: ${ratio.rw} / ${ratio.rh};` : "";

  const resizedFromWidth = useMemo(() => {
    if (!newWidth || !ratio) return null;
    const w = parseFloat(newWidth);
    if (isNaN(w) || w <= 0) return null;
    return Math.round((w * ratio.rh) / ratio.rw);
  }, [newWidth, ratio]);

  const resizedFromHeight = useMemo(() => {
    if (!newHeight || !ratio) return null;
    const h = parseFloat(newHeight);
    if (isNaN(h) || h <= 0) return null;
    return Math.round((h * ratio.rw) / ratio.rh);
  }, [newHeight, ratio]);

  const previewStyle = useMemo(() => {
    if (!width || !height || width <= 0 || height <= 0) return null;
    const maxW = 300;
    const maxH = 200;
    const scale = Math.min(maxW / width, maxH / height);
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
    };
  }, [width, height]);

  const applyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    setNewWidth("");
    setNewHeight("");
  };

  return (
    <ToolLayout
      title="Aspect Ratio Calculator"
      description="Calculate simplified aspect ratios, resize dimensions proportionally, and generate CSS aspect-ratio values."
      slug="aspect-ratio"
    >
      {/* Main inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={1}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min={1}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>
      </div>

      {/* Common presets */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">Common Ratios</label>
        <div className="flex flex-wrap gap-2">
          {commonRatios.map((r) => (
            <button
              key={r.label}
              onClick={() => applyPreset(r.w, r.h)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {ratio && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
              <span className="block text-xs text-[var(--muted-foreground)] mb-1">
                Simplified Ratio
              </span>
              <span className="text-xl font-bold font-mono">
                {ratio.simplified}
              </span>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
              <span className="block text-xs text-[var(--muted-foreground)] mb-1">
                Decimal Ratio
              </span>
              <span className="text-xl font-bold font-mono">
                {ratio.decimal}
              </span>
            </div>
          </div>

          {/* CSS property */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">CSS Property</span>
              <CopyButton text={cssValue} />
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono">
              {cssValue}
            </div>
          </div>

          {/* Visual preview */}
          {previewStyle && (
            <div className="mt-4">
              <span className="mb-2 block text-sm font-medium">
                Visual Preview
              </span>
              <div className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] p-6">
                <div
                  style={{
                    width: previewStyle.width,
                    height: previewStyle.height,
                  }}
                  className="rounded border-2 border-[var(--primary)] bg-[var(--primary)]/10 flex items-center justify-center"
                >
                  <span className="text-xs text-[var(--muted-foreground)] font-mono">
                    {width} x {height}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Resize calculator */}
          <div className="mt-4">
            <span className="mb-2 block text-sm font-medium">
              Resize Calculator
            </span>
            <div className="space-y-3">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
                <label className="mb-1 block text-xs text-[var(--muted-foreground)]">
                  Enter new width to calculate height
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={newWidth}
                    onChange={(e) => setNewWidth(e.target.value)}
                    placeholder="New width"
                    min={1}
                    className="w-32 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                  <span className="text-sm text-[var(--muted-foreground)]">
                    &rarr;
                  </span>
                  <span className="text-sm font-mono font-medium">
                    {resizedFromWidth !== null
                      ? `${newWidth} x ${resizedFromWidth}`
                      : "--"}
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
                <label className="mb-1 block text-xs text-[var(--muted-foreground)]">
                  Enter new height to calculate width
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => setNewHeight(e.target.value)}
                    placeholder="New height"
                    min={1}
                    className="w-32 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                  <span className="text-sm text-[var(--muted-foreground)]">
                    &rarr;
                  </span>
                  <span className="text-sm font-mono font-medium">
                    {resizedFromHeight !== null
                      ? `${resizedFromHeight} x ${newHeight}`
                      : "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
