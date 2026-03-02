"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

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

  const faqs = [
    {
      question: "How do I make a perfect circle with CSS?",
      answer: "Set border-radius to 50% on a square element (equal width and height). For example: width: 100px; height: 100px; border-radius: 50%. If the element is not square, you'll get an ellipse.",
    },
    {
      question: "What is the difference between px and % for border-radius?",
      answer: "Pixel values set a fixed corner radius regardless of element size. Percentage values are relative to the element's dimensions — 50% creates a circle/ellipse. Use px for consistent corners across different sizes, % for proportional rounding.",
    },
    {
      question: "Can I set different radii for each corner?",
      answer: "Yes. Use the four-value syntax: border-radius: top-left top-right bottom-right bottom-left. For example, border-radius: 10px 20px 30px 0px rounds each corner differently.",
    },
  ];

  return (
    <ToolLayout
      title="CSS Border Radius Generator"
      description="Generate CSS border-radius values with a visual editor. Customize each corner independently and copy the CSS."
      slug="border-radius-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Create CSS Border Radius",
              content: "Drag the corner sliders or enter pixel values to set border-radius for each corner independently. The live preview shows the resulting shape in real-time. You can link all corners for uniform rounding or control each corner separately for asymmetric designs. Copy the generated CSS with one click.",
            },
            {
              title: "Creative Uses of Border Radius in CSS",
              content: "Border-radius goes beyond simple rounded corners. Set it to 50% for perfect circles, use asymmetric values for organic shapes (like speech bubbles), combine with aspect-ratio for pills and capsule buttons. The full eight-value syntax (border-radius: x1 x2 x3 x4 / y1 y2 y3 y4) creates complex organic shapes by defining horizontal and vertical radii independently.",
            },
          ]}
          faqs={faqs}
        />
      }
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
