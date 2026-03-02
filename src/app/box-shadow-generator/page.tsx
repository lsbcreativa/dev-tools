"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

interface Shadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function hexToRgba(hex: string, opacity: number): string {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  const a = Math.round(opacity) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createDefaultShadow(): Shadow {
  return {
    id: generateId(),
    offsetX: 4,
    offsetY: 4,
    blur: 10,
    spread: 0,
    color: "#000000",
    opacity: 25,
    inset: false,
  };
}

function shadowToCSS(shadow: Shadow): string {
  const rgba = hexToRgba(shadow.color, shadow.opacity);
  const insetStr = shadow.inset ? "inset " : "";
  return `${insetStr}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${rgba}`;
}

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([createDefaultShadow()]);

  const boxShadowValue = shadows.map(shadowToCSS).join(", ");
  const cssOutput = `box-shadow: ${boxShadowValue};`;

  const updateShadow = (id: string, updates: Partial<Shadow>) => {
    setShadows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const removeShadow = (id: string) => {
    if (shadows.length <= 1) return;
    setShadows((prev) => prev.filter((s) => s.id !== id));
  };

  const addShadow = () => {
    setShadows((prev) => [...prev, createDefaultShadow()]);
  };

  return (
    <ToolLayout
      title="CSS Box Shadow Generator"
      description="Generate CSS box-shadow values with a visual editor. Customize multiple shadow layers and copy the CSS."
      slug="box-shadow-generator"
    >
      {/* Live Preview */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Preview</label>
        <div className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] p-12">
          <div
            className="rounded-xl bg-[var(--card)]"
            style={{
              width: 200,
              height: 200,
              boxShadow: boxShadowValue,
            }}
          />
        </div>
      </div>

      {/* Shadow Layers */}
      <div className="space-y-4">
        {shadows.map((shadow, index) => (
          <div
            key={shadow.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Shadow Layer {index + 1}</span>
              {shadows.length > 1 && (
                <button
                  onClick={() => removeShadow(shadow.id)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Offset X */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium">Offset X</label>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono">{shadow.offsetX}px</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={shadow.offsetX}
                  onChange={(e) => updateShadow(shadow.id, { offsetX: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Offset Y */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium">Offset Y</label>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono">{shadow.offsetY}px</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={shadow.offsetY}
                  onChange={(e) => updateShadow(shadow.id, { offsetY: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Blur */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium">Blur</label>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono">{shadow.blur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={shadow.blur}
                  onChange={(e) => updateShadow(shadow.id, { blur: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Spread */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium">Spread</label>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono">{shadow.spread}px</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={shadow.spread}
                  onChange={(e) => updateShadow(shadow.id, { spread: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium">Opacity</label>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono">{shadow.opacity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={shadow.opacity}
                  onChange={(e) => updateShadow(shadow.id, { opacity: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Color + Inset */}
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={shadow.color}
                      onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                      className="h-9 w-9 cursor-pointer rounded border border-[var(--border)]"
                    />
                    <input
                      type="text"
                      value={shadow.color}
                      onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                      className="w-24 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm font-mono"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 pb-1.5 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shadow.inset}
                    onChange={(e) => updateShadow(shadow.id, { inset: e.target.checked })}
                    className="rounded"
                  />
                  Inset
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Shadow Layer */}
      <div className="mt-4">
        <button
          onClick={addShadow}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
        >
          Add Shadow Layer
        </button>
      </div>

      {/* CSS Output */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">CSS Output</span>
          <CopyButton text={cssOutput} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
          {cssOutput}
        </pre>
      </div>
    </ToolLayout>
  );
}
