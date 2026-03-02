"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface GridItem {
  id: string;
  label: string;
  colSpan: string;
  rowSpan: string;
}

interface GridConfig {
  columns: string;
  rows: string;
  gap: number;
  justifyItems: string;
  alignItems: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function genId(): string {
  return Math.random().toString(36).substring(2, 9);
}

const ITEM_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#06b6d4",
  "#84cc16",
  "#f43f5e",
];

/* ------------------------------------------------------------------ */
/*  Presets                                                            */
/* ------------------------------------------------------------------ */
interface Preset {
  label: string;
  config: GridConfig;
  items: Omit<GridItem, "id">[];
}

const PRESETS: Preset[] = [
  {
    label: "2-Column",
    config: {
      columns: "1fr 1fr",
      rows: "auto",
      gap: 16,
      justifyItems: "stretch",
      alignItems: "stretch",
    },
    items: [
      { label: "1", colSpan: "auto", rowSpan: "auto" },
      { label: "2", colSpan: "auto", rowSpan: "auto" },
      { label: "3", colSpan: "auto", rowSpan: "auto" },
      { label: "4", colSpan: "auto", rowSpan: "auto" },
    ],
  },
  {
    label: "3-Column",
    config: {
      columns: "1fr 1fr 1fr",
      rows: "auto",
      gap: 16,
      justifyItems: "stretch",
      alignItems: "stretch",
    },
    items: [
      { label: "1", colSpan: "auto", rowSpan: "auto" },
      { label: "2", colSpan: "auto", rowSpan: "auto" },
      { label: "3", colSpan: "auto", rowSpan: "auto" },
      { label: "4", colSpan: "auto", rowSpan: "auto" },
      { label: "5", colSpan: "auto", rowSpan: "auto" },
      { label: "6", colSpan: "auto", rowSpan: "auto" },
    ],
  },
  {
    label: "Sidebar + Main",
    config: {
      columns: "250px 1fr",
      rows: "auto",
      gap: 16,
      justifyItems: "stretch",
      alignItems: "stretch",
    },
    items: [
      { label: "Sidebar", colSpan: "auto", rowSpan: "span 2" },
      { label: "Main", colSpan: "auto", rowSpan: "auto" },
      { label: "Content", colSpan: "auto", rowSpan: "auto" },
    ],
  },
  {
    label: "Holy Grail",
    config: {
      columns: "200px 1fr 200px",
      rows: "auto 1fr auto",
      gap: 12,
      justifyItems: "stretch",
      alignItems: "stretch",
    },
    items: [
      { label: "Header", colSpan: "span 3", rowSpan: "auto" },
      { label: "Nav", colSpan: "auto", rowSpan: "auto" },
      { label: "Main", colSpan: "auto", rowSpan: "auto" },
      { label: "Aside", colSpan: "auto", rowSpan: "auto" },
      { label: "Footer", colSpan: "span 3", rowSpan: "auto" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  CSS generation                                                     */
/* ------------------------------------------------------------------ */
function generateContainerCSS(config: GridConfig): string {
  const lines = [
    "display: grid;",
    `grid-template-columns: ${config.columns};`,
  ];
  if (config.rows && config.rows !== "auto") {
    lines.push(`grid-template-rows: ${config.rows};`);
  }
  lines.push(`gap: ${config.gap}px;`);
  if (config.justifyItems !== "stretch") {
    lines.push(`justify-items: ${config.justifyItems};`);
  }
  if (config.alignItems !== "stretch") {
    lines.push(`align-items: ${config.alignItems};`);
  }
  return `.grid-container {\n  ${lines.join("\n  ")}\n}`;
}

function generateItemsCSS(items: GridItem[]): string {
  const parts: string[] = [];
  items.forEach((item, i) => {
    const lines: string[] = [];
    if (item.colSpan && item.colSpan !== "auto") {
      lines.push(`  grid-column: ${item.colSpan};`);
    }
    if (item.rowSpan && item.rowSpan !== "auto") {
      lines.push(`  grid-row: ${item.rowSpan};`);
    }
    if (lines.length > 0) {
      parts.push(`.grid-item-${i + 1} {\n${lines.join("\n")}\n}`);
    }
  });
  return parts.join("\n\n");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const JUSTIFY_OPTIONS = ["stretch", "start", "center", "end"];
const ALIGN_OPTIONS = ["stretch", "start", "center", "end"];

export default function GridGenerator() {
  const [config, setConfig] = useState<GridConfig>({
    columns: "1fr 1fr 1fr",
    rows: "auto",
    gap: 16,
    justifyItems: "stretch",
    alignItems: "stretch",
  });

  const [items, setItems] = useState<GridItem[]>([
    { id: genId(), label: "1", colSpan: "auto", rowSpan: "auto" },
    { id: genId(), label: "2", colSpan: "auto", rowSpan: "auto" },
    { id: genId(), label: "3", colSpan: "auto", rowSpan: "auto" },
    { id: genId(), label: "4", colSpan: "auto", rowSpan: "auto" },
    { id: genId(), label: "5", colSpan: "auto", rowSpan: "auto" },
    { id: genId(), label: "6", colSpan: "auto", rowSpan: "auto" },
  ]);

  const updateConfig = (updates: Partial<GridConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateItem = (id: string, updates: Partial<GridItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: genId(),
        label: String(prev.length + 1),
        colSpan: "auto",
        rowSpan: "auto",
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const applyPreset = (preset: Preset) => {
    setConfig(preset.config);
    setItems(preset.items.map((item) => ({ ...item, id: genId() })));
  };

  const containerCSS = generateContainerCSS(config);
  const itemsCSS = generateItemsCSS(items);
  const fullCSS = itemsCSS ? `${containerCSS}\n\n${itemsCSS}` : containerCSS;

  const faqs = [
    {
      question: "What does 'fr' mean in CSS Grid?",
      answer: "The 'fr' unit represents a fraction of the available space. In 'grid-template-columns: 1fr 2fr', the second column gets twice the space of the first. It's the most flexible way to divide grid space proportionally.",
    },
    {
      question: "How do I create responsive grids without media queries?",
      answer: "Use grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)). This creates as many columns as will fit, each at least 250px wide. The grid automatically adjusts the number of columns based on viewport width.",
    },
    {
      question: "What are grid template areas?",
      answer: "Grid template areas let you name grid regions with strings: grid-template-areas: 'header header' 'sidebar main' 'footer footer'. Then assign items to areas with grid-area: header. This creates a visual map of your layout in CSS.",
    },
  ];

  return (
    <ToolLayout
      title="CSS Grid Generator"
      description="Build CSS Grid layouts visually. Configure columns, rows, gap, alignment, and copy the generated CSS."
      slug="grid-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Create CSS Grid Layouts",
              content: "Define your grid by setting the number of columns and rows, specifying track sizes (fr, px, %, auto), and configuring gap spacing. The visual editor shows the grid structure in real-time. Drag to define grid areas, name them, and see how items are placed. Copy the generated CSS for both the grid container and grid items.",
            },
            {
              title: "CSS Grid vs Flexbox: When to Use Each",
              content: "CSS Grid is designed for two-dimensional layouts — controlling both rows and columns simultaneously. It excels at page-level layouts, dashboard grids, and any design that requires items to align in both directions. Use grid-template-areas for named regions (header, sidebar, main, footer). Use Flexbox for one-dimensional content flow (navigation bars, card rows). Many modern layouts combine both — Grid for the page structure and Flexbox for component internals.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Presets */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Preview</label>
        <div
          className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4"
          style={{ minHeight: 250 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: config.columns,
              gridTemplateRows:
                config.rows && config.rows !== "auto"
                  ? config.rows
                  : undefined,
              gap: `${config.gap}px`,
              justifyItems:
                config.justifyItems !== "stretch"
                  ? (config.justifyItems as React.CSSProperties["justifyItems"])
                  : undefined,
              alignItems:
                config.alignItems !== "stretch"
                  ? (config.alignItems as React.CSSProperties["alignItems"])
                  : undefined,
              minHeight: 220,
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length],
                  gridColumn:
                    item.colSpan && item.colSpan !== "auto"
                      ? item.colSpan
                      : undefined,
                  gridRow:
                    item.rowSpan && item.rowSpan !== "auto"
                      ? item.rowSpan
                      : undefined,
                  padding: "16px 24px",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 50,
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Container Controls */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">Grid Container</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              grid-template-columns
            </label>
            <input
              type="text"
              value={config.columns}
              onChange={(e) => updateConfig({ columns: e.target.value })}
              placeholder="1fr 1fr 1fr"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              grid-template-rows
            </label>
            <input
              type="text"
              value={config.rows}
              onChange={(e) => updateConfig({ rows: e.target.value })}
              placeholder="auto"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium">gap</label>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">
                {config.gap}px
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={64}
              value={config.gap}
              onChange={(e) => updateConfig({ gap: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              justify-items
            </label>
            <select
              value={config.justifyItems}
              onChange={(e) =>
                updateConfig({ justifyItems: e.target.value })
              }
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              {JUSTIFY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              align-items
            </label>
            <select
              value={config.alignItems}
              onChange={(e) => updateConfig({ alignItems: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              {ALIGN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Item Controls */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Grid Items</h3>
          <button
            onClick={addItem}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
          >
            Add Item
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{
                      backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length],
                    }}
                  />
                  Item {i + 1}
                </span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Label
                  </label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      updateItem(item.id, { label: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    grid-column
                  </label>
                  <input
                    type="text"
                    value={item.colSpan}
                    onChange={(e) =>
                      updateItem(item.id, { colSpan: e.target.value })
                    }
                    placeholder="auto"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    grid-row
                  </label>
                  <input
                    type="text"
                    value={item.rowSpan}
                    onChange={(e) =>
                      updateItem(item.id, { rowSpan: e.target.value })
                    }
                    placeholder="auto"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">CSS Output</span>
          <CopyButton text={fullCSS} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-96">
          {fullCSS}
        </pre>
      </div>
    </ToolLayout>
  );
}
