"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

export default function CssGradientGenerator() {
  const [color1, setColor1] = useState("#2563eb");
  const [color2, setColor2] = useState("#9333ea");
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);

  const gradient =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const cssCode = `background: ${gradient};`;

  return (
    <ToolLayout
      title="CSS Gradient Generator"
      description="Create beautiful CSS gradients visually. Copy the CSS code instantly."
      slug="css-gradient-generator"
    >
      <div
        className="h-48 w-full rounded-xl border border-[var(--border)] shadow-inner sm:h-64"
        style={{ background: gradient }}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Color 1</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="flex-1 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm font-mono"
              maxLength={7}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Color 2</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="flex-1 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm font-mono"
              maxLength={7}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "linear" | "radial")}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        {type === "linear" && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Angle: {angle}°
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <button
            key={a}
            onClick={() => { setType("linear"); setAngle(a); }}
            className={`rounded-md border px-3 py-1 text-xs font-mono transition-colors btn-press ${
              type === "linear" && angle === a
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border-[var(--border)] hover:bg-[var(--muted)]"
            }`}
          >
            {a}°
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">CSS Code</span>
          <CopyButton text={cssCode} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </ToolLayout>
  );
}
