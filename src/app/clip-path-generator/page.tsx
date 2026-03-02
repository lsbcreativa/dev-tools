"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

type ShapeMode = "polygon" | "circle" | "ellipse" | "inset";

interface PolygonPreset {
  name: string;
  value: string;
}

const POLYGON_PRESETS: PolygonPreset[] = [
  { name: "Triangle", value: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { name: "Diamond", value: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  {
    name: "Pentagon",
    value: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  },
  {
    name: "Hexagon",
    value: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  },
  {
    name: "Parallelogram",
    value: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
  },
  {
    name: "Arrow",
    value:
      "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
  },
];

const faqs = [
  {
    question: "What is CSS clip-path?",
    answer:
      "CSS clip-path is a property that lets you define a visible region of an element. Any area outside the clipping path is hidden. You can create shapes like polygons, circles, ellipses, or insets to mask elements in creative ways without needing images or SVGs.",
  },
  {
    question: "How do clip-path percentages work?",
    answer:
      "Percentages in clip-path are relative to the element's own dimensions. For example, in polygon(), each point is expressed as (x% y%) where 0% 0% is the top-left corner and 100% 100% is the bottom-right corner. This makes the shape scale automatically with the element.",
  },
  {
    question: "What is browser support for clip-path?",
    answer:
      "clip-path is supported in all modern browsers. Chrome, Firefox, Safari, and Edge all support it. For older WebKit-based browsers you may need the -webkit-clip-path prefix. Internet Explorer does not support clip-path on HTML elements, only on SVG elements.",
  },
  {
    question: "What is the difference between clip-path and mask?",
    answer:
      "clip-path defines a simple geometric clipping region using shapes. CSS mask uses an image or gradient as a mask, allowing for more complex effects including partial transparency. clip-path is more performant for simple shapes, while mask offers more flexibility at the cost of complexity.",
  },
];

export default function ClipPathGenerator() {
  const [mode, setMode] = useState<ShapeMode>("polygon");
  const [selectedPreset, setSelectedPreset] = useState<string>(
    POLYGON_PRESETS[0].value
  );

  // Circle state
  const [circleRadius, setCircleRadius] = useState(50);
  const [circleX, setCircleX] = useState(50);
  const [circleY, setCircleY] = useState(50);

  // Ellipse state
  const [ellipseRx, setEllipseRx] = useState(50);
  const [ellipseRy, setEllipseRy] = useState(30);
  const [ellipseX, setEllipseX] = useState(50);
  const [ellipseY, setEllipseY] = useState(50);

  // Inset state
  const [insetTop, setInsetTop] = useState(10);
  const [insetRight, setInsetRight] = useState(20);
  const [insetBottom, setInsetBottom] = useState(10);
  const [insetLeft, setInsetLeft] = useState(20);
  const [insetRadius, setInsetRadius] = useState(0);

  function getClipPath(): string {
    switch (mode) {
      case "polygon":
        return selectedPreset;
      case "circle":
        return `circle(${circleRadius}% at ${circleX}% ${circleY}%)`;
      case "ellipse":
        return `ellipse(${ellipseRx}% ${ellipseRy}% at ${ellipseX}% ${ellipseY}%)`;
      case "inset":
        return insetRadius > 0
          ? `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}% round ${insetRadius}px)`
          : `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}%)`;
    }
  }

  const clipPathValue = getClipPath();
  const cssOutput = `.element {\n  clip-path: ${clipPathValue};\n  -webkit-clip-path: ${clipPathValue};\n}`;

  const tabs: { label: string; value: ShapeMode }[] = [
    { label: "Polygon", value: "polygon" },
    { label: "Circle", value: "circle" },
    { label: "Ellipse", value: "ellipse" },
    { label: "Inset", value: "inset" },
  ];

  return (
    <ToolLayout
      title="CSS Clip-path Generator"
      description="Generate CSS clip-path shapes visually. Create polygons, circles, ellipses with live preview and copy the CSS instantly."
      slug="clip-path-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Use CSS clip-path",
              content:
                "Select a shape mode from the tabs above — Polygon, Circle, Ellipse, or Inset. For polygons, pick a preset shape like Triangle, Diamond, or Hexagon. For other modes, use the sliders to adjust the shape parameters. The live preview updates in real time. When satisfied, copy the generated CSS with the copy button and paste it into your stylesheet.",
            },
            {
              title: "CSS clip-path Shapes: Complete Guide",
              content:
                "CSS clip-path supports several shape functions. polygon() lets you define any polygon using a list of percentage-based points. circle() creates a circular clipping region with a radius and center position. ellipse() is similar but allows different radii for the x and y axes. inset() creates a rectangular inset with optional rounded corners using the round keyword. All shapes scale with the element when using percentages, making them ideal for responsive designs.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Mode Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setMode(tab.value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all btn-press ${
              mode === tab.value
                ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Live Preview */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Live Preview</label>
        <div className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] p-12">
          <div
            style={{
              width: 200,
              height: 200,
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              clipPath: clipPathValue,
              WebkitClipPath: clipPathValue,
            }}
          />
        </div>
      </div>

      {/* Controls */}
      {mode === "polygon" && (
        <div>
          <label className="mb-3 block text-sm font-medium">
            Preset Shapes
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {POLYGON_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset.value)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all btn-press ${
                  selectedPreset === preset.value
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--muted)]/50 hover:border-[var(--primary)]/50"
                }`}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    clipPath: preset.value,
                    WebkitClipPath: preset.value,
                  }}
                />
                {preset.name}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3">
            <p className="text-xs font-mono text-[var(--muted-foreground)] break-all">
              {selectedPreset}
            </p>
          </div>
        </div>
      )}

      {mode === "circle" && (
        <div className="space-y-4">
          <SliderField
            label="Radius"
            value={circleRadius}
            unit="%"
            min={0}
            max={100}
            onChange={setCircleRadius}
          />
          <SliderField
            label="Position X"
            value={circleX}
            unit="%"
            min={0}
            max={100}
            onChange={setCircleX}
          />
          <SliderField
            label="Position Y"
            value={circleY}
            unit="%"
            min={0}
            max={100}
            onChange={setCircleY}
          />
        </div>
      )}

      {mode === "ellipse" && (
        <div className="space-y-4">
          <SliderField
            label="Radius X"
            value={ellipseRx}
            unit="%"
            min={0}
            max={100}
            onChange={setEllipseRx}
          />
          <SliderField
            label="Radius Y"
            value={ellipseRy}
            unit="%"
            min={0}
            max={100}
            onChange={setEllipseRy}
          />
          <SliderField
            label="Position X"
            value={ellipseX}
            unit="%"
            min={0}
            max={100}
            onChange={setEllipseX}
          />
          <SliderField
            label="Position Y"
            value={ellipseY}
            unit="%"
            min={0}
            max={100}
            onChange={setEllipseY}
          />
        </div>
      )}

      {mode === "inset" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SliderField
              label="Top"
              value={insetTop}
              unit="%"
              min={0}
              max={50}
              onChange={setInsetTop}
            />
            <SliderField
              label="Right"
              value={insetRight}
              unit="%"
              min={0}
              max={50}
              onChange={setInsetRight}
            />
            <SliderField
              label="Bottom"
              value={insetBottom}
              unit="%"
              min={0}
              max={50}
              onChange={setInsetBottom}
            />
            <SliderField
              label="Left"
              value={insetLeft}
              unit="%"
              min={0}
              max={50}
              onChange={setInsetLeft}
            />
          </div>
          <SliderField
            label="Border Radius"
            value={insetRadius}
            unit="px"
            min={0}
            max={100}
            onChange={setInsetRadius}
          />
        </div>
      )}

      {/* CSS Output */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">CSS Output</span>
          <CopyButton text={cssOutput} />
        </div>
        <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono">
          {cssOutput}
        </pre>
      </div>
    </ToolLayout>
  );
}

function SliderField({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="font-mono text-xs text-[var(--muted-foreground)]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
