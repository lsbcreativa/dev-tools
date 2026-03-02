"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ---------- Tailwind → CSS lookup ---------- */

const TW_MAP: Record<string, string> = {
  // Display
  block: "display: block",
  "inline-block": "display: inline-block",
  inline: "display: inline",
  flex: "display: flex",
  "inline-flex": "display: inline-flex",
  grid: "display: grid",
  "inline-grid": "display: inline-grid",
  hidden: "display: none",

  // Position
  static: "position: static",
  fixed: "position: fixed",
  absolute: "position: absolute",
  relative: "position: relative",
  sticky: "position: sticky",

  // Flex direction
  "flex-row": "flex-direction: row",
  "flex-col": "flex-direction: column",
  "flex-row-reverse": "flex-direction: row-reverse",
  "flex-col-reverse": "flex-direction: column-reverse",
  "flex-wrap": "flex-wrap: wrap",
  "flex-nowrap": "flex-wrap: nowrap",
  "flex-1": "flex: 1 1 0%",
  "flex-auto": "flex: 1 1 auto",
  "flex-initial": "flex: 0 1 auto",
  "flex-none": "flex: none",
  grow: "flex-grow: 1",
  "grow-0": "flex-grow: 0",
  shrink: "flex-shrink: 1",
  "shrink-0": "flex-shrink: 0",

  // Justify / Align
  "justify-start": "justify-content: flex-start",
  "justify-center": "justify-content: center",
  "justify-end": "justify-content: flex-end",
  "justify-between": "justify-content: space-between",
  "justify-around": "justify-content: space-around",
  "justify-evenly": "justify-content: space-evenly",
  "items-start": "align-items: flex-start",
  "items-center": "align-items: center",
  "items-end": "align-items: flex-end",
  "items-stretch": "align-items: stretch",
  "items-baseline": "align-items: baseline",
  "self-auto": "align-self: auto",
  "self-start": "align-self: flex-start",
  "self-center": "align-self: center",
  "self-end": "align-self: flex-end",
  "self-stretch": "align-self: stretch",

  // Grid
  "grid-cols-1": "grid-template-columns: repeat(1, minmax(0, 1fr))",
  "grid-cols-2": "grid-template-columns: repeat(2, minmax(0, 1fr))",
  "grid-cols-3": "grid-template-columns: repeat(3, minmax(0, 1fr))",
  "grid-cols-4": "grid-template-columns: repeat(4, minmax(0, 1fr))",
  "grid-cols-6": "grid-template-columns: repeat(6, minmax(0, 1fr))",
  "grid-cols-12": "grid-template-columns: repeat(12, minmax(0, 1fr))",
  "col-span-2": "grid-column: span 2 / span 2",
  "col-span-3": "grid-column: span 3 / span 3",
  "col-span-full": "grid-column: 1 / -1",

  // Gap
  "gap-0": "gap: 0px", "gap-1": "gap: 0.25rem", "gap-2": "gap: 0.5rem",
  "gap-3": "gap: 0.75rem", "gap-4": "gap: 1rem", "gap-5": "gap: 1.25rem",
  "gap-6": "gap: 1.5rem", "gap-8": "gap: 2rem", "gap-10": "gap: 2.5rem",
  "gap-12": "gap: 3rem",

  // Spacing (padding)
  "p-0": "padding: 0px", "p-1": "padding: 0.25rem", "p-2": "padding: 0.5rem",
  "p-3": "padding: 0.75rem", "p-4": "padding: 1rem", "p-5": "padding: 1.25rem",
  "p-6": "padding: 1.5rem", "p-8": "padding: 2rem", "p-10": "padding: 2.5rem",
  "p-12": "padding: 3rem", "p-16": "padding: 4rem", "p-20": "padding: 5rem",
  "px-0": "padding-left: 0px; padding-right: 0px",
  "px-1": "padding-left: 0.25rem; padding-right: 0.25rem",
  "px-2": "padding-left: 0.5rem; padding-right: 0.5rem",
  "px-3": "padding-left: 0.75rem; padding-right: 0.75rem",
  "px-4": "padding-left: 1rem; padding-right: 1rem",
  "px-5": "padding-left: 1.25rem; padding-right: 1.25rem",
  "px-6": "padding-left: 1.5rem; padding-right: 1.5rem",
  "px-8": "padding-left: 2rem; padding-right: 2rem",
  "py-0": "padding-top: 0px; padding-bottom: 0px",
  "py-1": "padding-top: 0.25rem; padding-bottom: 0.25rem",
  "py-2": "padding-top: 0.5rem; padding-bottom: 0.5rem",
  "py-3": "padding-top: 0.75rem; padding-bottom: 0.75rem",
  "py-4": "padding-top: 1rem; padding-bottom: 1rem",
  "py-6": "padding-top: 1.5rem; padding-bottom: 1.5rem",
  "py-8": "padding-top: 2rem; padding-bottom: 2rem",

  // Margin
  "m-0": "margin: 0px", "m-1": "margin: 0.25rem", "m-2": "margin: 0.5rem",
  "m-4": "margin: 1rem", "m-auto": "margin: auto",
  "mx-auto": "margin-left: auto; margin-right: auto",
  "my-auto": "margin-top: auto; margin-bottom: auto",
  "mt-0": "margin-top: 0px", "mt-1": "margin-top: 0.25rem",
  "mt-2": "margin-top: 0.5rem", "mt-4": "margin-top: 1rem",
  "mb-0": "margin-bottom: 0px", "mb-1": "margin-bottom: 0.25rem",
  "mb-2": "margin-bottom: 0.5rem", "mb-4": "margin-bottom: 1rem",
  "ml-auto": "margin-left: auto", "mr-auto": "margin-right: auto",

  // Width / Height
  "w-full": "width: 100%", "w-screen": "width: 100vw",
  "w-auto": "width: auto", "w-fit": "width: fit-content",
  "w-1/2": "width: 50%", "w-1/3": "width: 33.333333%", "w-2/3": "width: 66.666667%",
  "w-1/4": "width: 25%", "w-3/4": "width: 75%",
  "h-full": "height: 100%", "h-screen": "height: 100vh",
  "h-auto": "height: auto", "h-fit": "height: fit-content",
  "min-h-screen": "min-height: 100vh", "min-h-full": "min-height: 100%",
  "max-w-sm": "max-width: 24rem", "max-w-md": "max-width: 28rem",
  "max-w-lg": "max-width: 32rem", "max-w-xl": "max-width: 36rem",
  "max-w-2xl": "max-width: 42rem", "max-w-full": "max-width: 100%",

  // Font size
  "text-xs": "font-size: 0.75rem; line-height: 1rem",
  "text-sm": "font-size: 0.875rem; line-height: 1.25rem",
  "text-base": "font-size: 1rem; line-height: 1.5rem",
  "text-lg": "font-size: 1.125rem; line-height: 1.75rem",
  "text-xl": "font-size: 1.25rem; line-height: 1.75rem",
  "text-2xl": "font-size: 1.5rem; line-height: 2rem",
  "text-3xl": "font-size: 1.875rem; line-height: 2.25rem",
  "text-4xl": "font-size: 2.25rem; line-height: 2.5rem",

  // Font weight
  "font-thin": "font-weight: 100",
  "font-light": "font-weight: 300",
  "font-normal": "font-weight: 400",
  "font-medium": "font-weight: 500",
  "font-semibold": "font-weight: 600",
  "font-bold": "font-weight: 700",
  "font-extrabold": "font-weight: 800",

  // Text style
  italic: "font-style: italic",
  "not-italic": "font-style: normal",
  underline: "text-decoration-line: underline",
  "line-through": "text-decoration-line: line-through",
  "no-underline": "text-decoration-line: none",
  uppercase: "text-transform: uppercase",
  lowercase: "text-transform: lowercase",
  capitalize: "text-transform: capitalize",
  "normal-case": "text-transform: none",
  "text-left": "text-align: left",
  "text-center": "text-align: center",
  "text-right": "text-align: right",
  "text-justify": "text-align: justify",
  "whitespace-nowrap": "white-space: nowrap",
  "whitespace-pre": "white-space: pre",
  truncate: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap",
  "font-mono": "font-family: ui-monospace, monospace",
  "font-sans": "font-family: ui-sans-serif, sans-serif",
  "font-serif": "font-family: ui-serif, serif",
  "leading-none": "line-height: 1",
  "leading-tight": "line-height: 1.25",
  "leading-normal": "line-height: 1.5",
  "leading-relaxed": "line-height: 1.625",
  "leading-loose": "line-height: 2",
  "tracking-tight": "letter-spacing: -0.025em",
  "tracking-normal": "letter-spacing: 0em",
  "tracking-wide": "letter-spacing: 0.025em",

  // Text color
  "text-white": "color: #ffffff",
  "text-black": "color: #000000",
  "text-transparent": "color: transparent",

  // Background color
  "bg-white": "background-color: #ffffff",
  "bg-black": "background-color: #000000",
  "bg-transparent": "background-color: transparent",

  // Border
  border: "border-width: 1px",
  "border-0": "border-width: 0px",
  "border-2": "border-width: 2px",
  "border-4": "border-width: 4px",
  "border-t": "border-top-width: 1px",
  "border-b": "border-bottom-width: 1px",
  "border-l": "border-left-width: 1px",
  "border-r": "border-right-width: 1px",
  "border-solid": "border-style: solid",
  "border-dashed": "border-style: dashed",
  "border-dotted": "border-style: dotted",
  "border-none": "border-style: none",

  // Border radius
  "rounded-none": "border-radius: 0px",
  "rounded-sm": "border-radius: 0.125rem",
  rounded: "border-radius: 0.25rem",
  "rounded-md": "border-radius: 0.375rem",
  "rounded-lg": "border-radius: 0.5rem",
  "rounded-xl": "border-radius: 0.75rem",
  "rounded-2xl": "border-radius: 1rem",
  "rounded-3xl": "border-radius: 1.5rem",
  "rounded-full": "border-radius: 9999px",

  // Shadow
  "shadow-sm": "box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)",
  shadow: "box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  "shadow-md": "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  "shadow-lg": "box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  "shadow-xl": "box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "shadow-none": "box-shadow: 0 0 #0000",

  // Overflow
  "overflow-auto": "overflow: auto",
  "overflow-hidden": "overflow: hidden",
  "overflow-visible": "overflow: visible",
  "overflow-scroll": "overflow: scroll",
  "overflow-x-auto": "overflow-x: auto",
  "overflow-y-auto": "overflow-y: auto",

  // Opacity
  "opacity-0": "opacity: 0", "opacity-5": "opacity: 0.05",
  "opacity-10": "opacity: 0.1", "opacity-25": "opacity: 0.25",
  "opacity-50": "opacity: 0.5", "opacity-75": "opacity: 0.75",
  "opacity-100": "opacity: 1",

  // Cursor
  "cursor-pointer": "cursor: pointer",
  "cursor-default": "cursor: default",
  "cursor-not-allowed": "cursor: not-allowed",
  "cursor-grab": "cursor: grab",

  // Transitions
  "transition-all": "transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms",
  transition: "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms",
  "transition-colors": "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms",
  "duration-75": "transition-duration: 75ms",
  "duration-100": "transition-duration: 100ms",
  "duration-150": "transition-duration: 150ms",
  "duration-200": "transition-duration: 200ms",
  "duration-300": "transition-duration: 300ms",
  "duration-500": "transition-duration: 500ms",

  // Z-index
  "z-0": "z-index: 0", "z-10": "z-index: 10", "z-20": "z-index: 20",
  "z-30": "z-index: 30", "z-40": "z-index: 40", "z-50": "z-index: 50",

  // Inset
  "inset-0": "inset: 0px",
  "top-0": "top: 0px", "right-0": "right: 0px",
  "bottom-0": "bottom: 0px", "left-0": "left: 0px",

  // Object fit
  "object-contain": "object-fit: contain",
  "object-cover": "object-fit: cover",
  "object-fill": "object-fit: fill",
  "object-none": "object-fit: none",

  // Pointer events
  "pointer-events-none": "pointer-events: none",
  "pointer-events-auto": "pointer-events: auto",

  // Select
  "select-none": "user-select: none",
  "select-text": "user-select: text",
  "select-all": "user-select: all",

  // Misc
  "sr-only": "position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0",
  "aspect-square": "aspect-ratio: 1 / 1",
  "aspect-video": "aspect-ratio: 16 / 9",
};

/* ---------- Color resolver ---------- */

const COLOR_SCALES: Record<string, Record<string, string>> = {
  slate: { "50": "#f8fafc", "100": "#f1f5f9", "200": "#e2e8f0", "300": "#cbd5e1", "400": "#94a3b8", "500": "#64748b", "600": "#475569", "700": "#334155", "800": "#1e293b", "900": "#0f172a", "950": "#020617" },
  gray: { "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db", "400": "#9ca3af", "500": "#6b7280", "600": "#4b5563", "700": "#374151", "800": "#1f2937", "900": "#111827", "950": "#030712" },
  red: { "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5", "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c", "800": "#991b1b", "900": "#7f1d1d", "950": "#450a0a" },
  orange: { "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74", "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c", "800": "#9a3412", "900": "#7c2d12", "950": "#431407" },
  yellow: { "50": "#fefce8", "100": "#fef9c3", "200": "#fef08a", "300": "#fde047", "400": "#facc15", "500": "#eab308", "600": "#ca8a04", "700": "#a16207", "800": "#854d0e", "900": "#713f12", "950": "#422006" },
  green: { "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac", "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d", "800": "#166534", "900": "#14532d", "950": "#052e16" },
  blue: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" },
  indigo: { "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc", "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca", "800": "#3730a3", "900": "#312e81", "950": "#1e1b4b" },
  purple: { "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe", "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce", "800": "#6b21a8", "900": "#581c87", "950": "#3b0764" },
  pink: { "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4", "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d", "800": "#9d174d", "900": "#831843", "950": "#500724" },
  cyan: { "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9", "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490", "800": "#155e75", "900": "#164e63", "950": "#083344" },
  teal: { "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4", "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e", "800": "#115e59", "900": "#134e4a", "950": "#042f2e" },
};

function resolveColorClass(cls: string): string | null {
  // Match patterns like bg-blue-500, text-red-300, border-green-600
  const m = cls.match(/^(bg|text|border|ring|accent|fill|stroke)-(\w+)-(\d+)$/);
  if (!m) return null;
  const [, prefix, color, shade] = m;
  const hex = COLOR_SCALES[color]?.[shade];
  if (!hex) return null;
  const propMap: Record<string, string> = {
    bg: "background-color", text: "color", border: "border-color",
    ring: "box-shadow", accent: "accent-color", fill: "fill", stroke: "stroke",
  };
  const prop = propMap[prefix];
  if (prefix === "ring") return `box-shadow: 0 0 0 3px ${hex}`;
  return `${prop}: ${hex}`;
}

/* ---------- Resolver ---------- */

function resolveClass(cls: string): string | null {
  // Direct lookup
  if (TW_MAP[cls]) return TW_MAP[cls];

  // Color classes
  const color = resolveColorClass(cls);
  if (color) return color;

  // Spacing with numbers: w-{n}, h-{n}, size-{n}
  const sizeMatch = cls.match(/^(w|h|size)-(\d+)$/);
  if (sizeMatch) {
    const val = parseInt(sizeMatch[2]) * 0.25;
    const prop = sizeMatch[1] === "w" ? "width" : sizeMatch[1] === "h" ? "height" : "width; height";
    if (sizeMatch[1] === "size") return `width: ${val}rem; height: ${val}rem`;
    return `${prop}: ${val}rem`;
  }

  // Margin with numbers: m{t|b|l|r|x|y}-{n}
  const marginMatch = cls.match(/^-?m([trblxy])?-(\d+)$/);
  if (marginMatch) {
    const val = `${parseInt(marginMatch[2]) * 0.25}rem`;
    const neg = cls.startsWith("-") ? "-" : "";
    const dir = marginMatch[1];
    if (!dir) return `margin: ${neg}${val}`;
    if (dir === "t") return `margin-top: ${neg}${val}`;
    if (dir === "b") return `margin-bottom: ${neg}${val}`;
    if (dir === "l") return `margin-left: ${neg}${val}`;
    if (dir === "r") return `margin-right: ${neg}${val}`;
    if (dir === "x") return `margin-left: ${neg}${val}; margin-right: ${neg}${val}`;
    if (dir === "y") return `margin-top: ${neg}${val}; margin-bottom: ${neg}${val}`;
  }

  // Padding with numbers: p{t|b|l|r}-{n}
  const padMatch = cls.match(/^p([trbl])-(\d+)$/);
  if (padMatch) {
    const val = `${parseInt(padMatch[2]) * 0.25}rem`;
    const propMap: Record<string, string> = { t: "padding-top", b: "padding-bottom", l: "padding-left", r: "padding-right" };
    return `${propMap[padMatch[1]]}: ${val}`;
  }

  return null;
}

/* ---------- Presets ---------- */

const PRESETS = [
  { label: "Card", value: "bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto" },
  { label: "Button", value: "bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600" },
  { label: "Badge", value: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" },
  { label: "Centered layout", value: "min-h-screen flex items-center justify-center bg-gray-100" },
];

/* ---------- Component ---------- */

export default function TailwindPlaygroundPage() {
  const [classes, setClasses] = useState("");
  const [content, setContent] = useState("Hello World");

  const { cssRules, style, unresolved } = useMemo(() => {
    if (!classes.trim()) return { cssRules: [], style: {} as Record<string, string>, unresolved: [] as string[] };

    const tokens = classes.trim().split(/\s+/).filter(Boolean);
    const rules: string[] = [];
    const styleObj: Record<string, string> = {};
    const unknown: string[] = [];

    for (const token of tokens) {
      // Skip responsive/state prefixes for CSS output but note them
      const clean = token.replace(/^(sm|md|lg|xl|2xl|hover|focus|active|dark|group-hover):/, "");
      const css = resolveClass(clean);
      if (css) {
        rules.push(`  ${css};`);
        // Parse into style object
        css.split(";").forEach((decl) => {
          const [prop, val] = decl.split(":").map((s) => s.trim());
          if (prop && val) {
            const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            styleObj[camel] = val;
          }
        });
      } else {
        unknown.push(token);
      }
    }

    return { cssRules: rules, style: styleObj, unresolved: unknown };
  }, [classes]);

  const cssOutput = cssRules.length > 0
    ? `.element {\n${cssRules.join("\n")}\n}`
    : "";

  const faqs = [
    {
      question: "How does Tailwind's spacing scale work?",
      answer: "Tailwind uses a consistent spacing scale where each unit equals 0.25rem (4px). So p-1 = 4px, p-2 = 8px, p-4 = 16px, p-8 = 32px. This creates harmonious, consistent spacing throughout your design.",
    },
    {
      question: "What are responsive prefixes in Tailwind?",
      answer: "Prefixes like sm:, md:, lg:, and xl: apply classes only at specific breakpoints. For example, 'text-sm md:text-lg' sets small text by default and large text on medium+ screens. Tailwind uses a mobile-first approach.",
    },
    {
      question: "Can I use custom values in Tailwind?",
      answer: "Yes. Use arbitrary values in square brackets: w-[137px], text-[#1da1f2], grid-cols-[200px_1fr]. For frequently used custom values, extend the theme in tailwind.config.js.",
    },
  ];

  return (
    <ToolLayout
      title="Tailwind CSS Playground"
      description="Preview Tailwind CSS classes in real-time. See rendered output and generated CSS instantly."
      slug="tailwind-playground"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Preview Tailwind CSS Classes",
              content: "Type Tailwind CSS utility classes in the input field and see the rendered output instantly. The preview panel shows your element with the applied styles, and the CSS panel shows the equivalent CSS properties being generated. This is perfect for experimenting with Tailwind classes, learning the framework, and prototyping designs.",
            },
            {
              title: "Getting Started with Tailwind CSS",
              content: "Tailwind CSS is a utility-first CSS framework that provides low-level utility classes like flex, pt-4, text-center, and rotate-90 that you compose to build designs directly in your HTML. Unlike component frameworks (Bootstrap, Material UI), Tailwind doesn't provide pre-built components — it gives you the building blocks. Key concepts: responsive prefixes (sm:, md:, lg:), state variants (hover:, focus:, active:), and the spacing scale (p-1 = 0.25rem, p-4 = 1rem, p-8 = 2rem).",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setClasses(p.value)}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Classes input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Tailwind Classes</label>
        <textarea
          value={classes}
          onChange={(e) => setClasses(e.target.value)}
          placeholder="bg-blue-500 text-white p-4 rounded-lg shadow-md"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={2}
          spellCheck={false}
        />
      </div>

      {/* Content input */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">Preview content</label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm"
        />
      </div>

      {/* Unresolved classes */}
      {unresolved.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-700 dark:text-yellow-400">
          Unresolved classes (not in lookup table): <span className="font-mono">{unresolved.join(", ")}</span>
        </div>
      )}

      {/* Preview */}
      {classes.trim() && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Preview</label>
          <div className="rounded-lg border border-[var(--border)] bg-white p-8 min-h-[120px] flex items-center justify-center overflow-hidden">
            <div style={style}>
              {content}
            </div>
          </div>
        </div>
      )}

      {/* CSS output */}
      {cssOutput && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Generated CSS</span>
            <CopyButton text={cssOutput} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[400px] whitespace-pre-wrap">
            {cssOutput}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
