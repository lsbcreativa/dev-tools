"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

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

  const faqs = [
    {
      question: "What is a gradient color stop?",
      answer: "A color stop defines a color and its position along the gradient. For example, in 'linear-gradient(red 0%, blue 100%)', red at 0% and blue at 100% are color stops. You can add multiple stops to create smooth multi-color transitions.",
    },
    {
      question: "Do CSS gradients affect page performance?",
      answer: "CSS gradients are rendered by the browser's GPU and have minimal performance impact. They're more efficient than gradient images because they scale infinitely without file downloads and support retina displays natively.",
    },
    {
      question: "Can I animate CSS gradients?",
      answer: "You cannot directly animate gradient values with CSS transitions. However, you can animate the background-position or background-size of a larger gradient, or use the @property rule (Houdini) to animate custom properties within gradients.",
    },
  ];

  return (
    <ToolLayout
      title="CSS Gradient Generator"
      description="Create beautiful CSS gradients visually. Copy the CSS code instantly."
      slug="css-gradient-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Create CSS Gradients",
              content: "Choose between linear and radial gradients, add color stops, adjust the angle or position, and see the result in real-time. Copy the generated CSS code including vendor prefixes for maximum browser compatibility. You can add multiple color stops, adjust their positions, and create complex multi-color gradients.",
            },
            {
              title: "CSS Gradient Types and Use Cases",
              content: "Linear gradients transition colors along a straight line — use them for backgrounds, buttons, and overlays. Radial gradients transition from a center point outward — ideal for spotlight effects and circular elements. Conic gradients sweep colors around a center point — perfect for pie charts and color wheels. Modern browsers also support repeating gradients for pattern creation.",
            },
          ]}
          faqs={faqs}
        />
      }
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
