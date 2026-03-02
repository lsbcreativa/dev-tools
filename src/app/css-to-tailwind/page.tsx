"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ---------- Spacing scale (rem -> tailwind number) ---------- */

const SPACING: Record<string, string> = {
  "0": "0",
  "0px": "0",
  "1px": "px",
  "0.125rem": "0.5",
  "0.25rem": "1",
  "0.375rem": "1.5",
  "0.5rem": "2",
  "0.625rem": "2.5",
  "0.75rem": "3",
  "0.875rem": "3.5",
  "1rem": "4",
  "1.25rem": "5",
  "1.5rem": "6",
  "1.75rem": "7",
  "2rem": "8",
  "2.25rem": "9",
  "2.5rem": "10",
  "2.75rem": "11",
  "3rem": "12",
  "3.5rem": "14",
  "4rem": "16",
  "5rem": "20",
  "6rem": "24",
  "7rem": "28",
  "8rem": "32",
  "9rem": "36",
  "10rem": "40",
  "11rem": "44",
  "12rem": "48",
  "13rem": "52",
  "14rem": "56",
  "15rem": "60",
  "16rem": "64",
  "18rem": "72",
  "20rem": "80",
  "24rem": "96",
  "2px": "0.5",
  "4px": "1",
  "6px": "1.5",
  "8px": "2",
  "10px": "2.5",
  "12px": "3",
  "14px": "3.5",
  "16px": "4",
  "20px": "5",
  "24px": "6",
  "28px": "7",
  "32px": "8",
  "36px": "9",
  "40px": "10",
  "44px": "11",
  "48px": "12",
  "56px": "14",
  "64px": "16",
  "80px": "20",
  "96px": "24",
  "112px": "28",
  "128px": "32",
  "144px": "36",
  "160px": "40",
  "176px": "44",
  "192px": "48",
  "208px": "52",
  "224px": "56",
  "240px": "60",
  "256px": "64",
  "288px": "72",
  "320px": "80",
  "384px": "96",
};

function spacingVal(v: string): string | null {
  const trimmed = v.trim();
  return SPACING[trimmed] ?? null;
}

/* ---------- Property‑specific maps ---------- */

type Mapper = (value: string) => string | null;

function spacingMapper(prefix: string): Mapper {
  return (v: string) => {
    if (v === "auto") return `${prefix}-auto`;
    const s = spacingVal(v);
    return s !== null ? `${prefix}-${s}` : null;
  };
}

function directionalSpacing(
  baseProp: string,
  prefix: string
): [string, Mapper][] {
  return [
    [baseProp, (v: string) => {
      const parts = v.trim().split(/\s+/);
      if (parts.length === 1) {
        const s = spacingVal(parts[0]);
        if (parts[0] === "auto") return `${prefix}-auto`;
        return s !== null ? `${prefix}-${s}` : null;
      }
      if (parts.length === 2) {
        const y = spacingVal(parts[0]);
        const x = spacingVal(parts[1]);
        if (y !== null && x !== null) return `${prefix}y-${y} ${prefix}x-${x}`;
        return null;
      }
      if (parts.length === 4) {
        const t = spacingVal(parts[0]);
        const r = spacingVal(parts[1]);
        const b = spacingVal(parts[2]);
        const l = spacingVal(parts[3]);
        if (t !== null && r !== null && b !== null && l !== null) {
          return `${prefix}t-${t} ${prefix}r-${r} ${prefix}b-${b} ${prefix}l-${l}`;
        }
        return null;
      }
      return null;
    }],
    [`${baseProp}-top`, spacingMapper(`${prefix}t`)],
    [`${baseProp}-right`, spacingMapper(`${prefix}r`)],
    [`${baseProp}-bottom`, spacingMapper(`${prefix}b`)],
    [`${baseProp}-left`, spacingMapper(`${prefix}l`)],
  ];
}

const CSS_MAP: [string, Mapper][] = [
  // Display
  ["display", (v) => {
    const m: Record<string, string> = {
      flex: "flex", grid: "grid", block: "block", inline: "inline",
      "inline-block": "inline-block", "inline-flex": "inline-flex",
      "inline-grid": "inline-grid", none: "hidden", table: "table",
      "table-row": "table-row", "table-cell": "table-cell",
      contents: "contents",
    };
    return m[v.trim()] ?? null;
  }],

  // Position
  ["position", (v) => {
    const m: Record<string, string> = {
      relative: "relative", absolute: "absolute", fixed: "fixed",
      sticky: "sticky", static: "static",
    };
    return m[v.trim()] ?? null;
  }],

  // Top/Right/Bottom/Left
  ["top", spacingMapper("top")],
  ["right", spacingMapper("right")],
  ["bottom", spacingMapper("bottom")],
  ["left", spacingMapper("left")],

  // Margin
  ...directionalSpacing("margin", "m"),

  // Padding
  ...directionalSpacing("padding", "p"),

  // Gap
  ["gap", spacingMapper("gap")],
  ["row-gap", spacingMapper("gap-y")],
  ["column-gap", spacingMapper("gap-x")],

  // Width
  ["width", (v) => {
    const m: Record<string, string> = {
      "100%": "w-full", auto: "w-auto", "50%": "w-1/2",
      "33.333333%": "w-1/3", "66.666667%": "w-2/3",
      "25%": "w-1/4", "75%": "w-3/4",
      "min-content": "w-min", "max-content": "w-max", "fit-content": "w-fit",
      "100vw": "w-screen",
    };
    if (m[v.trim()]) return m[v.trim()];
    const s = spacingVal(v.trim());
    return s !== null ? `w-${s}` : null;
  }],

  ["min-width", (v) => {
    if (v.trim() === "0") return "min-w-0";
    if (v.trim() === "100%") return "min-w-full";
    if (v.trim() === "min-content") return "min-w-min";
    if (v.trim() === "max-content") return "min-w-max";
    return null;
  }],

  ["max-width", (v) => {
    if (v.trim() === "none") return "max-w-none";
    if (v.trim() === "100%") return "max-w-full";
    return null;
  }],

  // Height
  ["height", (v) => {
    const m: Record<string, string> = {
      "100%": "h-full", auto: "h-auto", "50%": "h-1/2",
      "100vh": "h-screen", "100dvh": "h-dvh",
      "min-content": "h-min", "max-content": "h-max", "fit-content": "h-fit",
    };
    if (m[v.trim()]) return m[v.trim()];
    const s = spacingVal(v.trim());
    return s !== null ? `h-${s}` : null;
  }],

  ["min-height", (v) => {
    if (v.trim() === "0") return "min-h-0";
    if (v.trim() === "100%") return "min-h-full";
    if (v.trim() === "100vh") return "min-h-screen";
    return null;
  }],

  // Font size
  ["font-size", (v) => {
    const m: Record<string, string> = {
      "0.75rem": "text-xs", "0.875rem": "text-sm", "1rem": "text-base",
      "1.125rem": "text-lg", "1.25rem": "text-xl", "1.5rem": "text-2xl",
      "1.875rem": "text-3xl", "2.25rem": "text-4xl", "3rem": "text-5xl",
      "3.75rem": "text-6xl", "4.5rem": "text-7xl", "6rem": "text-8xl",
      "8rem": "text-9xl",
      "12px": "text-xs", "14px": "text-sm", "16px": "text-base",
      "18px": "text-lg", "20px": "text-xl", "24px": "text-2xl",
      "30px": "text-3xl", "36px": "text-4xl", "48px": "text-5xl",
    };
    return m[v.trim()] ?? null;
  }],

  // Font weight
  ["font-weight", (v) => {
    const m: Record<string, string> = {
      "100": "font-thin", "200": "font-extralight", "300": "font-light",
      "400": "font-normal", "500": "font-medium", "600": "font-semibold",
      "700": "font-bold", "800": "font-extrabold", "900": "font-black",
      thin: "font-thin", normal: "font-normal", medium: "font-medium",
      semibold: "font-semibold", bold: "font-bold",
    };
    return m[v.trim()] ?? null;
  }],

  // Font style
  ["font-style", (v) => {
    if (v.trim() === "italic") return "italic";
    if (v.trim() === "normal") return "not-italic";
    return null;
  }],

  // Text alignment
  ["text-align", (v) => {
    const m: Record<string, string> = {
      left: "text-left", center: "text-center",
      right: "text-right", justify: "text-justify",
    };
    return m[v.trim()] ?? null;
  }],

  // Text decoration
  ["text-decoration", (v) => {
    const m: Record<string, string> = {
      underline: "underline", "line-through": "line-through",
      none: "no-underline", overline: "overline",
    };
    return m[v.trim()] ?? null;
  }],

  // Text transform
  ["text-transform", (v) => {
    const m: Record<string, string> = {
      uppercase: "uppercase", lowercase: "lowercase",
      capitalize: "capitalize", none: "normal-case",
    };
    return m[v.trim()] ?? null;
  }],

  // Line height
  ["line-height", (v) => {
    const m: Record<string, string> = {
      "1": "leading-none", "1.25": "leading-tight", "1.375": "leading-snug",
      "1.5": "leading-normal", "1.625": "leading-relaxed", "2": "leading-loose",
    };
    return m[v.trim()] ?? null;
  }],

  // Letter spacing
  ["letter-spacing", (v) => {
    const m: Record<string, string> = {
      "-0.05em": "tracking-tighter", "-0.025em": "tracking-tight",
      "0": "tracking-normal", "0em": "tracking-normal",
      "0.025em": "tracking-wide", "0.05em": "tracking-wider",
      "0.1em": "tracking-widest",
    };
    return m[v.trim()] ?? null;
  }],

  // Color
  ["color", (v) => {
    const m: Record<string, string> = {
      "#fff": "text-white", "#ffffff": "text-white", white: "text-white",
      "#000": "text-black", "#000000": "text-black", black: "text-black",
      transparent: "text-transparent", inherit: "text-inherit",
      currentColor: "text-current",
    };
    return m[v.trim().toLowerCase()] ?? null;
  }],

  // Background color
  ["background-color", (v) => {
    const m: Record<string, string> = {
      "#fff": "bg-white", "#ffffff": "bg-white", white: "bg-white",
      "#000": "bg-black", "#000000": "bg-black", black: "bg-black",
      transparent: "bg-transparent", inherit: "bg-inherit",
      currentColor: "bg-current",
    };
    return m[v.trim().toLowerCase()] ?? null;
  }],

  // Background
  ["background", (v) => {
    const t = v.trim().toLowerCase();
    if (t === "transparent") return "bg-transparent";
    if (t === "none") return "bg-none";
    return null;
  }],

  // Border radius
  ["border-radius", (v) => {
    const m: Record<string, string> = {
      "0": "rounded-none", "0px": "rounded-none",
      "0.125rem": "rounded-sm", "2px": "rounded-sm",
      "0.25rem": "rounded", "4px": "rounded",
      "0.375rem": "rounded-md", "6px": "rounded-md",
      "0.5rem": "rounded-lg", "8px": "rounded-lg",
      "0.75rem": "rounded-xl", "12px": "rounded-xl",
      "1rem": "rounded-2xl", "16px": "rounded-2xl",
      "1.5rem": "rounded-3xl", "24px": "rounded-3xl",
      "9999px": "rounded-full", "50%": "rounded-full",
    };
    return m[v.trim()] ?? null;
  }],

  // Border width
  ["border-width", (v) => {
    const m: Record<string, string> = {
      "0": "border-0", "0px": "border-0",
      "1px": "border", "2px": "border-2",
      "4px": "border-4", "8px": "border-8",
    };
    return m[v.trim()] ?? null;
  }],

  // Border style
  ["border-style", (v) => {
    const m: Record<string, string> = {
      solid: "border-solid", dashed: "border-dashed",
      dotted: "border-dotted", double: "border-double", none: "border-none",
    };
    return m[v.trim()] ?? null;
  }],

  // Border color
  ["border-color", (v) => {
    const m: Record<string, string> = {
      "#fff": "border-white", "#ffffff": "border-white", white: "border-white",
      "#000": "border-black", "#000000": "border-black", black: "border-black",
      transparent: "border-transparent", inherit: "border-inherit",
      currentColor: "border-current",
    };
    return m[v.trim().toLowerCase()] ?? null;
  }],

  // Justify content
  ["justify-content", (v) => {
    const m: Record<string, string> = {
      center: "justify-center", "flex-start": "justify-start",
      "flex-end": "justify-end", "space-between": "justify-between",
      "space-around": "justify-around", "space-evenly": "justify-evenly",
      start: "justify-start", end: "justify-end",
    };
    return m[v.trim()] ?? null;
  }],

  // Align items
  ["align-items", (v) => {
    const m: Record<string, string> = {
      center: "items-center", "flex-start": "items-start",
      "flex-end": "items-end", stretch: "items-stretch",
      baseline: "items-baseline", start: "items-start", end: "items-end",
    };
    return m[v.trim()] ?? null;
  }],

  // Align self
  ["align-self", (v) => {
    const m: Record<string, string> = {
      auto: "self-auto", center: "self-center",
      "flex-start": "self-start", "flex-end": "self-end",
      stretch: "self-stretch", baseline: "self-baseline",
    };
    return m[v.trim()] ?? null;
  }],

  // Flex direction
  ["flex-direction", (v) => {
    const m: Record<string, string> = {
      row: "flex-row", "row-reverse": "flex-row-reverse",
      column: "flex-col", "column-reverse": "flex-col-reverse",
    };
    return m[v.trim()] ?? null;
  }],

  // Flex wrap
  ["flex-wrap", (v) => {
    const m: Record<string, string> = {
      wrap: "flex-wrap", nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    };
    return m[v.trim()] ?? null;
  }],

  // Flex grow / shrink
  ["flex-grow", (v) => {
    if (v.trim() === "0") return "grow-0";
    if (v.trim() === "1") return "grow";
    return null;
  }],
  ["flex-shrink", (v) => {
    if (v.trim() === "0") return "shrink-0";
    if (v.trim() === "1") return "shrink";
    return null;
  }],

  // Flex
  ["flex", (v) => {
    const m: Record<string, string> = {
      "1": "flex-1", "1 1 0%": "flex-1",
      auto: "flex-auto", "1 1 auto": "flex-auto",
      initial: "flex-initial", "0 1 auto": "flex-initial",
      none: "flex-none", "0 0 auto": "flex-none",
    };
    return m[v.trim()] ?? null;
  }],

  // Overflow
  ["overflow", (v) => {
    const m: Record<string, string> = {
      hidden: "overflow-hidden", auto: "overflow-auto",
      scroll: "overflow-scroll", visible: "overflow-visible",
      clip: "overflow-clip",
    };
    return m[v.trim()] ?? null;
  }],
  ["overflow-x", (v) => {
    const m: Record<string, string> = {
      hidden: "overflow-x-hidden", auto: "overflow-x-auto",
      scroll: "overflow-x-scroll", visible: "overflow-x-visible",
    };
    return m[v.trim()] ?? null;
  }],
  ["overflow-y", (v) => {
    const m: Record<string, string> = {
      hidden: "overflow-y-hidden", auto: "overflow-y-auto",
      scroll: "overflow-y-scroll", visible: "overflow-y-visible",
    };
    return m[v.trim()] ?? null;
  }],

  // Cursor
  ["cursor", (v) => {
    const m: Record<string, string> = {
      pointer: "cursor-pointer", default: "cursor-default",
      "not-allowed": "cursor-not-allowed", wait: "cursor-wait",
      text: "cursor-text", move: "cursor-move", help: "cursor-help",
      crosshair: "cursor-crosshair", grab: "cursor-grab",
      grabbing: "cursor-grabbing", none: "cursor-none",
    };
    return m[v.trim()] ?? null;
  }],

  // Opacity
  ["opacity", (v) => {
    const m: Record<string, string> = {
      "0": "opacity-0", "0.05": "opacity-5", "0.1": "opacity-10",
      "0.2": "opacity-20", "0.25": "opacity-25", "0.3": "opacity-30",
      "0.4": "opacity-40", "0.5": "opacity-50", "0.6": "opacity-60",
      "0.7": "opacity-70", "0.75": "opacity-75", "0.8": "opacity-80",
      "0.9": "opacity-90", "0.95": "opacity-95", "1": "opacity-100",
    };
    return m[v.trim()] ?? null;
  }],

  // Z-index
  ["z-index", (v) => {
    const m: Record<string, string> = {
      "0": "z-0", "10": "z-10", "20": "z-20", "30": "z-30",
      "40": "z-40", "50": "z-50", auto: "z-auto",
    };
    return m[v.trim()] ?? null;
  }],

  // Object fit
  ["object-fit", (v) => {
    const m: Record<string, string> = {
      contain: "object-contain", cover: "object-cover",
      fill: "object-fill", none: "object-none",
      "scale-down": "object-scale-down",
    };
    return m[v.trim()] ?? null;
  }],

  // White space
  ["white-space", (v) => {
    const m: Record<string, string> = {
      normal: "whitespace-normal", nowrap: "whitespace-nowrap",
      pre: "whitespace-pre", "pre-line": "whitespace-pre-line",
      "pre-wrap": "whitespace-pre-wrap", "break-spaces": "whitespace-break-spaces",
    };
    return m[v.trim()] ?? null;
  }],

  // Word break / overflow wrap
  ["word-break", (v) => {
    if (v.trim() === "break-all") return "break-all";
    if (v.trim() === "keep-all") return "break-keep";
    return null;
  }],
  ["overflow-wrap", (v) => {
    if (v.trim() === "break-word") return "break-words";
    return null;
  }],

  // Pointer events
  ["pointer-events", (v) => {
    if (v.trim() === "none") return "pointer-events-none";
    if (v.trim() === "auto") return "pointer-events-auto";
    return null;
  }],

  // User select
  ["user-select", (v) => {
    const m: Record<string, string> = {
      none: "select-none", text: "select-text",
      all: "select-all", auto: "select-auto",
    };
    return m[v.trim()] ?? null;
  }],

  // Visibility
  ["visibility", (v) => {
    if (v.trim() === "visible") return "visible";
    if (v.trim() === "hidden") return "invisible";
    if (v.trim() === "collapse") return "collapse";
    return null;
  }],

  // Box sizing
  ["box-sizing", (v) => {
    if (v.trim() === "border-box") return "box-border";
    if (v.trim() === "content-box") return "box-content";
    return null;
  }],

  // List style
  ["list-style-type", (v) => {
    const m: Record<string, string> = {
      none: "list-none", disc: "list-disc", decimal: "list-decimal",
    };
    return m[v.trim()] ?? null;
  }],

  // Transition
  ["transition", (v) => {
    if (v.trim() === "none") return "transition-none";
    if (v.trim().includes("all")) return "transition-all";
    if (v.trim().includes("color") || v.trim().includes("background")) return "transition-colors";
    if (v.trim().includes("opacity")) return "transition-opacity";
    if (v.trim().includes("transform")) return "transition-transform";
    return null;
  }],

  // Transform
  ["transform", (v) => {
    if (v.trim() === "none") return "transform-none";
    return null;
  }],

  // Box shadow
  ["box-shadow", (v) => {
    if (v.trim() === "none") return "shadow-none";
    return null;
  }],

  // Outline
  ["outline", (v) => {
    if (v.trim() === "none" || v.trim() === "0") return "outline-none";
    return null;
  }],

  // Resize
  ["resize", (v) => {
    const m: Record<string, string> = {
      none: "resize-none", both: "resize",
      vertical: "resize-y", horizontal: "resize-x",
    };
    return m[v.trim()] ?? null;
  }],

  // Appearance
  ["appearance", (v) => {
    if (v.trim() === "none") return "appearance-none";
    if (v.trim() === "auto") return "appearance-auto";
    return null;
  }],

  // Text overflow
  ["text-overflow", (v) => {
    if (v.trim() === "ellipsis") return "text-ellipsis";
    if (v.trim() === "clip") return "text-clip";
    return null;
  }],

  // Grid template columns
  ["grid-template-columns", (v) => {
    const match = v.trim().match(/^repeat\((\d+),\s*1fr\)$/);
    if (match) return `grid-cols-${match[1]}`;
    if (v.trim() === "none") return "grid-cols-none";
    return null;
  }],

  // Grid template rows
  ["grid-template-rows", (v) => {
    const match = v.trim().match(/^repeat\((\d+),\s*1fr\)$/);
    if (match) return `grid-rows-${match[1]}`;
    if (v.trim() === "none") return "grid-rows-none";
    return null;
  }],
];

/* ---------- Converter ---------- */

interface ConvertedLine {
  property: string;
  value: string;
  tailwind: string | null;
}

function convertCss(input: string): ConvertedLine[] {
  const lines = input
    .split(/[;\n]/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("/*") && !l.startsWith("//"));

  const results: ConvertedLine[] = [];

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const property = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim().replace(/;$/, "").trim();

    if (!property || !value) continue;

    let tw: string | null = null;
    for (const [prop, mapper] of CSS_MAP) {
      if (prop === property) {
        tw = mapper(value);
        break;
      }
    }

    results.push({ property, value, tailwind: tw });
  }

  return results;
}

/* ---------- Component ---------- */

export default function CssToTailwindPage() {
  const [input, setInput] = useState("");

  const results = useMemo(() => {
    if (!input.trim()) return [];
    return convertCss(input);
  }, [input]);

  const tailwindClasses = results
    .map((r) => r.tailwind)
    .filter(Boolean)
    .join(" ");

  const unmatchedComment = results
    .filter((r) => r.tailwind === null)
    .map((r) => `/* no match: ${r.property}: ${r.value} */`)
    .join("\n");

  const fullOutput = unmatchedComment
    ? tailwindClasses + (tailwindClasses ? "\n\n" : "") + unmatchedComment
    : tailwindClasses;

  const faqs = [
    {
      question: "Does this converter support all CSS properties?",
      answer:
        "This tool covers the most commonly used CSS properties including layout (display, position, flexbox, grid), spacing (margin, padding, gap), typography, colors, borders, sizing, and more. Complex properties like custom animations or CSS variables require manual conversion.",
    },
    {
      question: "How accurate is the CSS to Tailwind conversion?",
      answer:
        "The conversion is approximate — it maps standard CSS values to their closest Tailwind equivalents. Tailwind uses a specific spacing scale (0, 1, 2, 4, 8, etc.), so CSS values that don't align with this scale may not convert. Always review the output.",
    },
    {
      question: "Can I convert responsive CSS to Tailwind?",
      answer:
        "This tool converts individual CSS declarations. For responsive styles, convert each breakpoint's CSS separately, then prefix the Tailwind classes manually (sm:, md:, lg:, xl:) according to your design requirements.",
    },
    {
      question: "What about custom colors and spacing values?",
      answer:
        "Tailwind's default theme includes specific color palettes and spacing scales. CSS values using custom colors (like hex codes beyond black/white) or non-standard spacing values are flagged as 'no match'. You can extend Tailwind's theme config to support custom values.",
    },
  ];

  return (
    <ToolLayout
      title="CSS to Tailwind"
      description="Convert CSS properties to Tailwind CSS utility classes."
      slug="css-to-tailwind"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert CSS to Tailwind CSS",
              content:
                "Paste your CSS declarations and get equivalent Tailwind CSS utility classes instantly. This tool maps over 60 CSS properties to their Tailwind equivalents, including display, position, flexbox, grid, spacing (margin, padding, gap), typography (font-size, font-weight, text-align), colors, borders, border-radius, opacity, overflow, cursor, and more. Properties that don't have a direct Tailwind match are flagged so you know what needs manual conversion.",
            },
            {
              title: "Why Migrate from CSS to Tailwind CSS",
              content:
                "Tailwind CSS eliminates the need to write custom CSS by providing utility classes that map directly to CSS properties. Benefits include smaller bundle sizes through automatic purging of unused classes, consistent design tokens (spacing, colors, breakpoints), faster prototyping with inline utility classes, and easier maintenance since styles live alongside your markup. This converter helps you migrate existing CSS codebases to Tailwind incrementally, property by property.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Warning */}
      <div className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm text-[var(--muted-foreground)]">
        This is an approximate conversion. Review the output carefully.
      </div>

      {/* Input */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Paste CSS declarations
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            "display: flex;\njustify-content: center;\nalign-items: center;\ngap: 1rem;\npadding: 1.5rem;\nborder-radius: 0.5rem;\nfont-weight: 600;"
          }
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={8}
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {results.length > 0 && (
        <div className="mt-4 space-y-4">
          {/* Tailwind classes */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Tailwind Classes</span>
              <CopyButton text={tailwindClasses || ""} />
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono break-all">
              {tailwindClasses || (
                <span className="text-[var(--muted-foreground)]">
                  No matching classes found
                </span>
              )}
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <span className="mb-2 block text-sm font-medium">
              Property Breakdown
            </span>
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                    <th className="px-3 py-2 text-left font-medium">CSS</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Tailwind
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-3 py-2 font-mono text-xs">
                        {r.property}: {r.value}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {r.tailwind ? (
                          <span className="text-[var(--success)]">
                            {r.tailwind}
                          </span>
                        ) : (
                          <span className="text-[var(--destructive)]">
                            no match
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full output for copy */}
          {unmatchedComment && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--muted-foreground)]">
                  Full output (with unmatched)
                </span>
                <CopyButton text={fullOutput} />
              </div>
              <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                {fullOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
