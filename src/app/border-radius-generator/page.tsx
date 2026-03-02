"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

export default function BorderRadiusGenerator() {
  const [topLeft, setTopLeft] = useState(16);
  const [topRight, setTopRight] = useState(16);
  const [bottomRight, setBottomRight] = useState(16);
  const [bottomLeft, setBottomLeft] = useState(16);
  const [linked, setLinked] = useState(true);

  const handleChange = (corner: string, value: number) => {
    if (linked) {
      setTopLeft(value);
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    } else {
      switch (corner) {
        case "topLeft":
          setTopLeft(value);
          break;
        case "topRight":
          setTopRight(value);
          break;
        case "bottomRight":
          setBottomRight(value);
          break;
        case "bottomLeft":
          setBottomLeft(value);
          break;
      }
    }
  };

  const applyPreset = (value: number | string) => {
    if (typeof value === "string") {
      // 50% circle - use 50 as a value with percent display
      setTopLeft(50);
      setTopRight(50);
      setBottomRight(50);
      setBottomLeft(50);
    } else {
      setTopLeft(value);
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    }
  };

  const allSame = topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;
  const cssValue = allSame
    ? `border-radius: ${topLeft}px;`
    : `border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px;`;

  const presets = [
    { label: "0 (Square)", value: 0 },
    { label: "8px", value: 8 },
    { label: "16px", value: 16 },
    { label: "24px", value: 24 },
    { label: "50% (Circle)", value: "50%" },
  ];

  const corners = [
    { key: "topLeft", label: "Top Left", value: topLeft },
    { key: "topRight", label: "Top Right", value: topRight },
    { key: "bottomRight", label: "Bottom Right", value: bottomRight },
    { key: "bottomLeft", label: "Bottom Left", value: bottomLeft },
  ];

  return (
    <ToolLayout
      title="CSS Border Radius Generator"
      description="Generate CSS border-radius values with a visual editor. Customize each corner independently and copy the CSS."
      slug="border-radius-generator"
    >
      {/* Preview */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Preview</label>
        <div className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] p-12">
          <div
            className="bg-[var(--primary)]"
            style={{
              width: 200,
              height: 200,
              borderRadius: `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`,
            }}
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Link/Unlink Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setLinked(!linked)}
          className={`rounded-lg px-4 py-2 text-sm font-medium btn-press ${
            linked
              ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
              : "border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
          }`}
        >
          {linked ? "Linked (all corners)" : "Unlinked (individual corners)"}
        </button>
      </div>

      {/* Corner Sliders */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {corners.map((corner) => (
          <div key={corner.key}>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium">{corner.label}</label>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">
                {corner.value}px
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={corner.value}
              onChange={(e) => handleChange(corner.key, Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* CSS Output */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">CSS Output</span>
          <CopyButton text={cssValue} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
          {cssValue}
        </pre>
      </div>
    </ToolLayout>
  );
}
