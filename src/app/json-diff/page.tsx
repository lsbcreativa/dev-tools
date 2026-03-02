"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ------------------------------------------------------------------ */
/*  Deep diff types & algorithm                                        */
/* ------------------------------------------------------------------ */
type DiffType = "added" | "removed" | "changed" | "unchanged";

interface DiffNode {
  key: string;
  type: DiffType;
  oldValue?: unknown;
  newValue?: unknown;
  children?: DiffNode[];
}

function deepDiff(
  oldObj: unknown,
  newObj: unknown,
  key: string = "(root)"
): DiffNode {
  // Both are objects (non-null, non-array)
  if (
    isPlainObject(oldObj) &&
    isPlainObject(newObj)
  ) {
    const oldKeys = Object.keys(oldObj as Record<string, unknown>);
    const newKeys = Object.keys(newObj as Record<string, unknown>);
    const allKeys = new Set([...oldKeys, ...newKeys]);
    const children: DiffNode[] = [];

    for (const k of allKeys) {
      const inOld = oldKeys.includes(k);
      const inNew = newKeys.includes(k);

      if (inOld && !inNew) {
        children.push({
          key: k,
          type: "removed",
          oldValue: (oldObj as Record<string, unknown>)[k],
        });
      } else if (!inOld && inNew) {
        children.push({
          key: k,
          type: "added",
          newValue: (newObj as Record<string, unknown>)[k],
        });
      } else {
        children.push(
          deepDiff(
            (oldObj as Record<string, unknown>)[k],
            (newObj as Record<string, unknown>)[k],
            k
          )
        );
      }
    }

    const hasChanges = children.some((c) => c.type !== "unchanged");
    return {
      key,
      type: hasChanges ? "changed" : "unchanged",
      children,
    };
  }

  // Both are arrays
  if (Array.isArray(oldObj) && Array.isArray(newObj)) {
    const maxLen = Math.max(oldObj.length, newObj.length);
    const children: DiffNode[] = [];

    for (let i = 0; i < maxLen; i++) {
      if (i >= oldObj.length) {
        children.push({ key: String(i), type: "added", newValue: newObj[i] });
      } else if (i >= newObj.length) {
        children.push({ key: String(i), type: "removed", oldValue: oldObj[i] });
      } else {
        children.push(deepDiff(oldObj[i], newObj[i], String(i)));
      }
    }

    const hasChanges = children.some((c) => c.type !== "unchanged");
    return {
      key,
      type: hasChanges ? "changed" : "unchanged",
      children,
    };
  }

  // Primitive comparison
  if (oldObj === newObj) {
    return { key, type: "unchanged", oldValue: oldObj, newValue: newObj };
  }

  return { key, type: "changed", oldValue: oldObj, newValue: newObj };
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

/* ------------------------------------------------------------------ */
/*  Counting stats                                                     */
/* ------------------------------------------------------------------ */
interface DiffStats {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
}

function countStats(node: DiffNode): DiffStats {
  const stats: DiffStats = { added: 0, removed: 0, changed: 0, unchanged: 0 };

  if (node.children) {
    for (const child of node.children) {
      if (child.children) {
        const childStats = countStats(child);
        stats.added += childStats.added;
        stats.removed += childStats.removed;
        stats.changed += childStats.changed;
        stats.unchanged += childStats.unchanged;
      } else {
        stats[child.type]++;
      }
    }
  } else {
    stats[node.type]++;
  }

  return stats;
}

/* ------------------------------------------------------------------ */
/*  Tree rendering                                                     */
/* ------------------------------------------------------------------ */
function DiffTreeNode({ node, depth }: { node: DiffNode; depth: number }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const bgMap: Record<DiffType, string> = {
    added: "bg-green-500/10",
    removed: "bg-red-500/10",
    changed: "bg-amber-500/10",
    unchanged: "",
  };

  const dotMap: Record<DiffType, string> = {
    added: "bg-green-500",
    removed: "bg-red-500",
    changed: "bg-amber-500",
    unchanged: "bg-gray-400",
  };

  const labelMap: Record<DiffType, string> = {
    added: "text-green-600 dark:text-green-400",
    removed: "text-red-600 dark:text-red-400",
    changed: "text-amber-600 dark:text-amber-400",
    unchanged: "text-[var(--muted-foreground)]",
  };

  function formatValue(val: unknown): string {
    if (val === undefined) return "undefined";
    if (typeof val === "string") return `"${val}"`;
    return JSON.stringify(val);
  }

  // Leaf node (no children)
  if (!hasChildren) {
    const bg = bgMap[node.type];
    return (
      <div
        className={`flex items-start gap-2 py-1 px-2 rounded ${bg}`}
        style={{ paddingLeft: depth * 20 + 8 }}
      >
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotMap[node.type]}`}
        />
        <span className="text-sm font-mono">
          <span className="font-medium">{node.key}</span>
          {node.type === "added" && (
            <span className={labelMap.added}>
              {": "}
              {formatValue(node.newValue)}
              <span className="ml-2 text-xs opacity-70">(added)</span>
            </span>
          )}
          {node.type === "removed" && (
            <span className={labelMap.removed}>
              {": "}
              {formatValue(node.oldValue)}
              <span className="ml-2 text-xs opacity-70">(removed)</span>
            </span>
          )}
          {node.type === "changed" && (
            <span className={labelMap.changed}>
              {": "}
              <span className="line-through opacity-60">
                {formatValue(node.oldValue)}
              </span>
              {" -> "}
              {formatValue(node.newValue)}
            </span>
          )}
          {node.type === "unchanged" && (
            <span className={labelMap.unchanged}>
              {": "}
              {formatValue(node.oldValue)}
            </span>
          )}
        </span>
      </div>
    );
  }

  // Branch node (has children)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 py-1 px-2 rounded w-full text-left hover:bg-[var(--muted)]/50 ${bgMap[node.type]}`}
        style={{ paddingLeft: depth * 20 + 8 }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-sm font-mono font-medium">{node.key}</span>
        <span className="text-xs text-[var(--muted-foreground)]">
          {"{"}
          {node.children!.length}
          {"}"}
        </span>
      </button>
      {open && (
        <div>
          {node.children!.map((child, i) => (
            <DiffTreeNode key={`${child.key}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function JsonDiffViewer() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<DiffNode | null>(null);
  const [stats, setStats] = useState<DiffStats | null>(null);
  const [error, setError] = useState("");

  const handleCompare = () => {
    try {
      const origParsed = JSON.parse(original);
      const modParsed = JSON.parse(modified);
      const result = deepDiff(origParsed, modParsed);
      setDiff(result);
      setStats(countStats(result));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setDiff(null);
      setStats(null);
    }
  };

  const loadSample = () => {
    setOriginal(
      JSON.stringify(
        {
          name: "DevTools",
          version: 1,
          features: ["format", "validate"],
          config: { theme: "dark", lang: "en" },
          deprecated: true,
        },
        null,
        2
      )
    );
    setModified(
      JSON.stringify(
        {
          name: "DevTools Pro",
          version: 2,
          features: ["format", "validate", "diff"],
          config: { theme: "light", lang: "en", beta: true },
        },
        null,
        2
      )
    );
    setDiff(null);
    setStats(null);
    setError("");
  };

  const diffSummary = diff
    ? JSON.stringify(
        {
          summary: stats,
          diff: serializeDiff(diff),
        },
        null,
        2
      )
    : "";

  const faqs = [
    {
      question: "Does key order matter in JSON comparison?",
      answer: "In JSON, key order is not significant — {a:1, b:2} and {b:2, a:1} are equivalent. This tool compares by key names regardless of order, so reordered keys will not show as differences.",
    },
    {
      question: "Can I compare JSON arrays?",
      answer: "Yes. Arrays are compared element by element based on their index position. If arrays have different lengths, extra elements are shown as additions or removals.",
    },
    {
      question: "How are nested changes displayed?",
      answer: "Nested changes are shown with their full path (e.g., 'data.user.name'). Each level of nesting is compared recursively, so you can see exactly which nested field changed.",
    },
  ];

  return (
    <ToolLayout
      title="JSON Diff Viewer"
      description="Compare two JSON objects and visualize the differences with a color-coded tree view."
      slug="json-diff"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Compare JSON Objects",
              content: "Paste two JSON objects in the left and right panels and see a detailed comparison of their differences. The tool identifies added keys (present only in the right), removed keys (present only in the left), changed values, and unchanged fields. Nested objects and arrays are compared recursively to show exactly where differences occur.",
            },
            {
              title: "JSON Diff Use Cases for Developers",
              content: "JSON comparison is essential for debugging API responses (comparing expected vs actual), reviewing configuration changes, tracking state changes in applications, comparing database records, and validating data migrations. Unlike text diff which compares line by line, JSON diff understands the data structure and can detect semantic differences like reordered keys and type changes.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Textareas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Original</label>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={10}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Modified</label>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder='{"key": "newValue"}'
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={10}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleCompare}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Compare
        </button>
        <button
          onClick={loadSample}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
        >
          Load Sample
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {stats.added} added
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {stats.removed} removed
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {stats.changed} changed
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            {stats.unchanged} unchanged
          </span>
        </div>
      )}

      {/* Tree View */}
      {diff && diff.children && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Diff Tree</span>
            <CopyButton text={diffSummary} label="Copy Diff" />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2 overflow-x-auto max-h-[32rem] overflow-y-auto">
            {diff.children.map((child, i) => (
              <DiffTreeNode key={`${child.key}-${i}`} node={child} depth={0} />
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}

/* ------------------------------------------------------------------ */
/*  Serialize diff tree for copy                                       */
/* ------------------------------------------------------------------ */
function serializeDiff(node: DiffNode): unknown {
  if (node.children) {
    const obj: Record<string, unknown> = {};
    for (const child of node.children) {
      if (child.children) {
        obj[child.key] = serializeDiff(child);
      } else {
        switch (child.type) {
          case "added":
            obj[`+ ${child.key}`] = child.newValue;
            break;
          case "removed":
            obj[`- ${child.key}`] = child.oldValue;
            break;
          case "changed":
            obj[`~ ${child.key}`] = {
              old: child.oldValue,
              new: child.newValue,
            };
            break;
          case "unchanged":
            obj[child.key] = child.oldValue;
            break;
        }
      }
    }
    return obj;
  }
  return node.oldValue;
}
