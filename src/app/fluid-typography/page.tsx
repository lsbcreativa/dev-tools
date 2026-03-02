"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

interface TypographyElement {
  id: string;
  label: string;
  selector: string;
  minSize: number;
  maxSize: number;
}

const defaultElements: TypographyElement[] = [
  { id: "h1", label: "H1", selector: "h1", minSize: 32, maxSize: 64 },
  { id: "h2", label: "H2", selector: "h2", minSize: 26, maxSize: 48 },
  { id: "h3", label: "H3", selector: "h3", minSize: 22, maxSize: 36 },
  { id: "h4", label: "H4", selector: "h4", minSize: 18, maxSize: 28 },
  { id: "body", label: "Body", selector: "body", minSize: 16, maxSize: 20 },
];

function calcClamp(
  minSize: number,
  maxSize: number,
  minVw: number,
  maxVw: number
): string {
  const minSizeRem = minSize / 16;
  const maxSizeRem = maxSize / 16;

  const slope = (maxSize - minSize) / (maxVw - minVw);
  const slopeVw = +(slope * 100).toFixed(4);
  const intercept = +(minSizeRem - (slope * minVw) / 16).toFixed(4);

  const preferred =
    intercept >= 0
      ? `${intercept}rem + ${slopeVw}vw`
      : `${intercept}rem + ${slopeVw}vw`;

  return `clamp(${minSizeRem.toFixed(4)}rem, ${preferred}, ${maxSizeRem.toFixed(4)}rem)`;
}

export default function FluidTypographyCalculator() {
  const [minViewport, setMinViewport] = useState(320);
  const [maxViewport, setMaxViewport] = useState(1280);
  const [elements, setElements] =
    useState<TypographyElement[]>(defaultElements);

  const updateElement = (
    id: string,
    field: "minSize" | "maxSize",
    value: number
  ) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [field]: value } : el))
    );
  };

  const clampValues = useMemo(() => {
    return elements.map((el) => ({
      ...el,
      clamp: calcClamp(el.minSize, el.maxSize, minViewport, maxViewport),
    }));
  }, [elements, minViewport, maxViewport]);

  const cssOutput = clampValues
    .map((el) => `${el.selector} {\n  font-size: ${el.clamp};\n}`)
    .join("\n\n");

  return (
    <ToolLayout
      title="Fluid Typography Calculator"
      description="Generate CSS clamp() values for fluid, responsive typography that scales smoothly between viewport sizes."
      slug="fluid-typography"
    >
      {/* Viewport settings */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">Viewport Range</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Min Viewport (px)
            </label>
            <input
              type="number"
              value={minViewport}
              onChange={(e) => setMinViewport(Number(e.target.value) || 0)}
              min={0}
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Max Viewport (px)
            </label>
            <input
              type="number"
              value={maxViewport}
              onChange={(e) => setMaxViewport(Number(e.target.value) || 0)}
              min={0}
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Element settings */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">Font Sizes</h3>
        <div className="space-y-3">
          {elements.map((el) => (
            <div
              key={el.id}
              className="grid grid-cols-[80px_1fr_1fr] items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3"
            >
              <span className="text-sm font-semibold">{el.label}</span>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted-foreground)]">
                  Min Size (px)
                </label>
                <input
                  type="number"
                  value={el.minSize}
                  onChange={(e) =>
                    updateElement(el.id, "minSize", Number(e.target.value) || 0)
                  }
                  min={0}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm font-mono"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted-foreground)]">
                  Max Size (px)
                </label>
                <input
                  type="number"
                  value={el.maxSize}
                  onChange={(e) =>
                    updateElement(el.id, "maxSize", Number(e.target.value) || 0)
                  }
                  min={0}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">Preview</h3>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-6 space-y-3 overflow-hidden">
          {clampValues.map((el) => (
            <div key={el.id}>
              <span className="text-xs text-[var(--muted-foreground)] font-mono block mb-0.5">
                {el.selector} &mdash; {el.clamp}
              </span>
              <p
                style={{ fontSize: `${el.maxSize}px`, lineHeight: 1.2 }}
                className="font-semibold truncate"
              >
                {el.label === "Body"
                  ? "The quick brown fox jumps over the lazy dog."
                  : `${el.label} Heading Example`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div>
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
