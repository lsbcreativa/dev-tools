"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

interface FlexItem {
  id: string;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: string;
  order: number;
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
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createDefaultItem(index: number): FlexItem {
  return {
    id: generateId(),
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
    alignSelf: "auto",
    order: index,
  };
}

export default function FlexboxGenerator() {
  const [flexDirection, setFlexDirection] = useState<string>("row");
  const [justifyContent, setJustifyContent] = useState<string>("flex-start");
  const [alignItems, setAlignItems] = useState<string>("stretch");
  const [flexWrap, setFlexWrap] = useState<string>("nowrap");
  const [gap, setGap] = useState<number>(8);

  const [items, setItems] = useState<FlexItem[]>([
    createDefaultItem(0),
    createDefaultItem(1),
    createDefaultItem(2),
  ]);

  const updateItem = (id: string, updates: Partial<FlexItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, createDefaultItem(prev.length)]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const containerCSS = `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`;

  const itemsCSS = items
    .map((item, i) => {
      const lines: string[] = [];
      if (item.flexGrow !== 0) lines.push(`  flex-grow: ${item.flexGrow};`);
      if (item.flexShrink !== 1) lines.push(`  flex-shrink: ${item.flexShrink};`);
      if (item.flexBasis !== "auto") lines.push(`  flex-basis: ${item.flexBasis};`);
      if (item.alignSelf !== "auto") lines.push(`  align-self: ${item.alignSelf};`);
      if (item.order !== i) lines.push(`  order: ${item.order};`);
      if (lines.length === 0) return null;
      return `.item-${i + 1} {\n${lines.join("\n")}\n}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const fullCSS = itemsCSS ? `${containerCSS}\n\n${itemsCSS}` : containerCSS;

  const directionOptions = ["row", "column", "row-reverse", "column-reverse"];
  const justifyOptions = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];
  const alignOptions = ["stretch", "flex-start", "center", "flex-end", "baseline"];
  const wrapOptions = ["nowrap", "wrap", "wrap-reverse"];
  const alignSelfOptions = ["auto", "stretch", "flex-start", "center", "flex-end", "baseline"];

  const faqs = [
    {
      question: "What is the difference between justify-content and align-items?",
      answer: "justify-content distributes items along the main axis (horizontal in row direction). align-items positions items along the cross axis (vertical in row direction). Think of justify-content as horizontal alignment and align-items as vertical alignment in a default row layout.",
    },
    {
      question: "When should I use Flexbox vs CSS Grid?",
      answer: "Use Flexbox for one-dimensional layouts (a single row or column of items) — navigation bars, card rows, vertically centered content. Use CSS Grid for two-dimensional layouts (rows AND columns) — page layouts, dashboards, complex grid structures.",
    },
    {
      question: "What does flex: 1 mean?",
      answer: "flex: 1 is shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%. It makes the item grow to fill available space equally with other flex: 1 items. It's the most common way to create equal-width columns.",
    },
  ];

  return (
    <ToolLayout
      title="CSS Flexbox Generator"
      description="Build CSS flexbox layouts visually. Configure container and item properties, preview live, and copy the generated CSS."
      slug="flexbox-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Create CSS Flexbox Layouts",
              content: "Configure flexbox container properties (direction, justify-content, align-items, flex-wrap, gap) and see the layout update in real-time. Add, remove, and configure flex items with individual properties like flex-grow, flex-shrink, flex-basis, and align-self. Copy the generated CSS code for both container and items.",
            },
            {
              title: "Understanding CSS Flexbox",
              content: "Flexbox (Flexible Box Layout) is a CSS layout model designed for one-dimensional layouts — either rows or columns. It excels at distributing space between items, aligning items vertically and horizontally, and creating responsive layouts without media queries. Key concepts: the flex container defines the layout context, flex items are direct children, the main axis follows flex-direction, and the cross axis is perpendicular. Flexbox is supported by all modern browsers.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Preview */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Preview</label>
        <div
          className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4"
          style={{ minHeight: 200 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: flexDirection as React.CSSProperties["flexDirection"],
              justifyContent,
              alignItems,
              flexWrap: flexWrap as React.CSSProperties["flexWrap"],
              gap: `${gap}px`,
              minHeight: 180,
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length],
                  flexGrow: item.flexGrow,
                  flexShrink: item.flexShrink,
                  flexBasis: item.flexBasis,
                  alignSelf: item.alignSelf === "auto" ? undefined : item.alignSelf,
                  order: item.order,
                  padding: "16px 24px",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 40,
                  minHeight: 40,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Container Controls */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">Container Properties</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* flex-direction */}
          <div>
            <label className="mb-1 block text-sm font-medium">flex-direction</label>
            <select
              value={flexDirection}
              onChange={(e) => setFlexDirection(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              {directionOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* justify-content */}
          <div>
            <label className="mb-1 block text-sm font-medium">justify-content</label>
            <select
              value={justifyContent}
              onChange={(e) => setJustifyContent(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              {justifyOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* align-items */}
          <div>
            <label className="mb-1 block text-sm font-medium">align-items</label>
            <select
              value={alignItems}
              onChange={(e) => setAlignItems(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              {alignOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* flex-wrap */}
          <div>
            <label className="mb-1 block text-sm font-medium">flex-wrap</label>
            <select
              value={flexWrap}
              onChange={(e) => setFlexWrap(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              {wrapOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* gap */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium">gap</label>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">{gap}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={64}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Item Controls */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Item Properties</h3>
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
                    style={{ backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length] }}
                  />
                  Item {i + 1}
                </span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="mb-1 block text-sm font-medium">flex-grow</label>
                  <input
                    type="number"
                    min={0}
                    value={item.flexGrow}
                    onChange={(e) => updateItem(item.id, { flexGrow: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">flex-shrink</label>
                  <input
                    type="number"
                    min={0}
                    value={item.flexShrink}
                    onChange={(e) => updateItem(item.id, { flexShrink: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">flex-basis</label>
                  <input
                    type="text"
                    value={item.flexBasis}
                    onChange={(e) => updateItem(item.id, { flexBasis: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">align-self</label>
                  <select
                    value={item.alignSelf}
                    onChange={(e) => updateItem(item.id, { alignSelf: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  >
                    {alignSelfOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">order</label>
                  <input
                    type="number"
                    value={item.order}
                    onChange={(e) => updateItem(item.id, { order: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">CSS Output</span>
          <CopyButton text={fullCSS} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
          {fullCSS}
        </pre>
      </div>
    </ToolLayout>
  );
}
