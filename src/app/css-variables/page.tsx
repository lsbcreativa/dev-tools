"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

type TabId = "colors" | "spacing" | "typography" | "shadows" | "custom";

interface CssVar {
  id: string;
  name: string;
  value: string;
}

function uid(): string {
  return Math.random().toString(36).substring(2, 9);
}

function makeVar(name: string, value: string): CssVar {
  return { id: uid(), name, value };
}

const DEFAULT_COLORS: CssVar[] = [
  makeVar("--color-primary", "#3b82f6"),
  makeVar("--color-secondary", "#8b5cf6"),
  makeVar("--color-background", "#ffffff"),
  makeVar("--color-text", "#111827"),
  makeVar("--color-border", "#e5e7eb"),
];

const DEFAULT_SPACING: CssVar[] = [
  makeVar("--spacing-xs", "4px"),
  makeVar("--spacing-sm", "8px"),
  makeVar("--spacing-md", "16px"),
  makeVar("--spacing-lg", "24px"),
  makeVar("--spacing-xl", "32px"),
];

const DEFAULT_TYPOGRAPHY: CssVar[] = [
  makeVar("--font-sans", "system-ui, sans-serif"),
  makeVar("--font-mono", "ui-monospace, monospace"),
  makeVar("--font-size-sm", "0.875rem"),
  makeVar("--font-size-base", "1rem"),
  makeVar("--font-size-lg", "1.125rem"),
  makeVar("--font-weight-normal", "400"),
  makeVar("--font-weight-bold", "700"),
];

const DEFAULT_SHADOWS: CssVar[] = [
  makeVar("--shadow-sm", "0 1px 2px rgba(0,0,0,0.05)"),
  makeVar("--shadow-md", "0 4px 6px rgba(0,0,0,0.07)"),
  makeVar("--shadow-lg", "0 10px 15px rgba(0,0,0,0.10)"),
  makeVar("--shadow-xl", "0 20px 25px rgba(0,0,0,0.10)"),
];

function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(value.trim());
}

const faqs = [
  {
    question: "What are CSS variables?",
    answer:
      "CSS variables (officially called CSS custom properties) are entities defined by CSS authors that contain specific values to be reused throughout a document. They are set using custom property notation (--name: value) and accessed using the var() function (var(--name)). They support inheritance and can be updated with JavaScript at runtime.",
  },
  {
    question: "What is the difference between CSS variables and Sass variables?",
    answer:
      "Sass variables ($color: blue) are processed at compile time and replaced with their values in the output CSS — they have no runtime presence. CSS custom properties (--color: blue) exist in the browser and can be changed dynamically with JavaScript or overridden in media queries and component scopes. CSS variables also cascade and inherit, which Sass variables do not.",
  },
  {
    question: "How do I use CSS custom properties?",
    answer:
      "Define variables in the :root selector to make them globally available: :root { --color-primary: #3b82f6; }. Then use them anywhere in your CSS with the var() function: color: var(--color-primary). You can also provide a fallback: color: var(--color-primary, blue).",
  },
  {
    question: "What are CSS design tokens?",
    answer:
      "Design tokens are named values that represent design decisions — colors, spacing, typography, shadows. CSS custom properties are the ideal format for implementing design tokens in the browser. By centralizing these values in :root, you create a single source of truth for your design system that can be easily updated and themed.",
  },
];

export default function CssVariablesGenerator() {
  const [activeTab, setActiveTab] = useState<TabId>("colors");
  const [colors, setColors] = useState<CssVar[]>(DEFAULT_COLORS);
  const [spacing, setSpacing] = useState<CssVar[]>(DEFAULT_SPACING);
  const [typography, setTypography] = useState<CssVar[]>(DEFAULT_TYPOGRAPHY);
  const [shadows, setShadows] = useState<CssVar[]>(DEFAULT_SHADOWS);
  const [custom, setCustom] = useState<CssVar[]>([]);

  const getSetterForTab = useCallback(
    (tab: TabId): React.Dispatch<React.SetStateAction<CssVar[]>> => {
      switch (tab) {
        case "colors":
          return setColors;
        case "spacing":
          return setSpacing;
        case "typography":
          return setTypography;
        case "shadows":
          return setShadows;
        case "custom":
          return setCustom;
      }
    },
    []
  );

  const getVarsForTab = (tab: TabId): CssVar[] => {
    switch (tab) {
      case "colors":
        return colors;
      case "spacing":
        return spacing;
      case "typography":
        return typography;
      case "shadows":
        return shadows;
      case "custom":
        return custom;
    }
  };

  const addVar = (tab: TabId) => {
    const setter = getSetterForTab(tab);
    const defaults: Record<TabId, { name: string; value: string }> = {
      colors: { name: "--color-new", value: "#000000" },
      spacing: { name: "--spacing-new", value: "16px" },
      typography: { name: "--font-size-new", value: "1rem" },
      shadows: { name: "--shadow-new", value: "0 2px 4px rgba(0,0,0,0.1)" },
      custom: { name: "--my-variable", value: "value" },
    };
    setter((prev) => [...prev, makeVar(defaults[tab].name, defaults[tab].value)]);
  };

  const updateVar = (
    tab: TabId,
    id: string,
    field: "name" | "value",
    newVal: string
  ) => {
    const setter = getSetterForTab(tab);
    setter((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: newVal } : v))
    );
  };

  const deleteVar = (tab: TabId, id: string) => {
    const setter = getSetterForTab(tab);
    setter((prev) => prev.filter((v) => v.id !== id));
  };

  // Generate CSS output
  function buildGroup(label: string, vars: CssVar[]): string {
    if (vars.length === 0) return "";
    const lines = vars
      .filter((v) => v.name.trim())
      .map((v) => `  ${v.name}: ${v.value};`)
      .join("\n");
    return `  /* ${label} */\n${lines}`;
  }

  const groups = [
    buildGroup("Colors", colors),
    buildGroup("Spacing", spacing),
    buildGroup("Typography", typography),
    buildGroup("Shadows", shadows),
    buildGroup("Custom", custom),
  ].filter(Boolean);

  const cssOutput =
    groups.length > 0
      ? `:root {\n${groups.join("\n\n")}\n}`
      : ":root {\n  /* Add variables above */\n}";

  const handleDownload = () => {
    const blob = new Blob([cssOutput], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "variables.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "colors", label: "Colors" },
    { id: "spacing", label: "Spacing" },
    { id: "typography", label: "Typography" },
    { id: "shadows", label: "Shadows" },
    { id: "custom", label: "Custom" },
  ];

  const currentVars = getVarsForTab(activeTab);

  return (
    <ToolLayout
      title="CSS Variables Generator"
      description="Define design tokens — colors, spacing, typography, shadows — and generate a :root CSS variables block."
      slug="css-variables"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "CSS Custom Properties: Complete Guide",
              content:
                "CSS custom properties are defined with a double-dash prefix (--name) and scoped to the selector they are declared in. Placing them in :root makes them globally available. They cascade and inherit just like other CSS properties, which means you can override them in component scopes or media queries. Access them with var(--name) and optionally provide a fallback: var(--name, fallback-value). Custom properties can hold any valid CSS value including colors, lengths, strings, and even partial values.",
            },
            {
              title: "Building a Design Token System with CSS Variables",
              content:
                "A design token system centralizes all design decisions — brand colors, spacing scale, type scale, border radii, shadows — as named variables. Start by defining semantic tokens (--color-primary, --spacing-md) in :root. Components reference these tokens rather than raw values, making global design changes a one-line update. You can layer multiple token sets for light/dark themes: override :root variables in a [data-theme='dark'] selector. Export tokens as a .css file and import it at the root of your application.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Editor */}
        <div>
          {/* Tab bar */}
          <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all btn-press ${
                  activeTab === tab.id
                    ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Variable rows */}
          <div className="space-y-2">
            {currentVars.length === 0 && (
              <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
                No variables yet. Click &quot;Add Variable&quot; below.
              </p>
            )}
            {currentVars.map((v) => (
              <VarRow
                key={v.id}
                variable={v}
                tab={activeTab}
                onUpdate={(field, val) => updateVar(activeTab, v.id, field, val)}
                onDelete={() => deleteVar(activeTab, v.id)}
              />
            ))}
          </div>

          <button
            onClick={() => addVar(activeTab)}
            className="mt-3 w-full rounded-lg border border-dashed border-[var(--border)] py-2 text-sm font-medium text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            + Add Variable
          </button>
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">CSS Output</span>
            <div className="flex gap-2">
              <CopyButton text={cssOutput} />
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium transition-all hover:bg-[var(--muted)] btn-press"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download .css
              </button>
            </div>
          </div>
          <pre className="flex-1 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-xs font-mono leading-relaxed min-h-[300px]">
            {cssOutput}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

function VarRow({
  variable,
  tab,
  onUpdate,
  onDelete,
}: {
  variable: CssVar;
  tab: TabId;
  onUpdate: (field: "name" | "value", value: string) => void;
  onDelete: () => void;
}) {
  const showColorPicker = tab === "colors" && isHexColor(variable.value);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-2">
      {/* Color swatch or spacing preview */}
      {tab === "colors" && (
        <div className="flex items-center gap-1.5 shrink-0">
          {showColorPicker ? (
            <input
              type="color"
              value={variable.value}
              onChange={(e) => onUpdate("value", e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border border-[var(--border)]"
              title="Pick color"
            />
          ) : (
            <div
              className="h-7 w-7 rounded border border-[var(--border)]"
              style={{ backgroundColor: variable.value }}
            />
          )}
        </div>
      )}

      {/* Name input */}
      <input
        type="text"
        value={variable.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs font-mono outline-none focus:border-[var(--primary)] transition-colors"
        placeholder="--variable-name"
        spellCheck={false}
      />

      {/* Value input */}
      <input
        type="text"
        value={variable.value}
        onChange={(e) => onUpdate("value", e.target.value)}
        className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs font-mono outline-none focus:border-[var(--primary)] transition-colors"
        placeholder="value"
        spellCheck={false}
      />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="shrink-0 rounded p-1 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
        title="Delete"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  );
}
