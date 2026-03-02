"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- Types ---------- */

type Alignment = "left" | "center" | "right";

/* ---------- Sample data ---------- */

const SAMPLE_HEADERS = ["Feature", "Status", "Priority", "Assignee"];
const SAMPLE_ROWS = [
  ["Dark mode", "In Progress", "High", "Alice"],
  ["Search API", "Done", "Critical", "Bob"],
  ["Dashboard", "Planned", "Medium", "Carol"],
  ["Export CSV", "In Progress", "Low", "David"],
];
const SAMPLE_ALIGNMENTS: Alignment[] = ["left", "center", "center", "left"];

/* ---------- Helpers ---------- */

function createEmptyGrid(
  rows: number,
  cols: number
): { data: string[][]; alignments: Alignment[] } {
  const data: string[][] = [];
  for (let r = 0; r < rows; r++) {
    data.push(Array(cols).fill(""));
  }
  return {
    data,
    alignments: Array(cols).fill("left" as Alignment),
  };
}

function generateMarkdown(
  data: string[][],
  alignments: Alignment[]
): string {
  if (data.length === 0 || data[0].length === 0) return "";

  const cols = data[0].length;
  const headers = data[0];
  const bodyRows = data.slice(1);

  // Calculate column widths (minimum 3 for separator)
  const colWidths = Array(cols).fill(3);
  for (const row of data) {
    for (let c = 0; c < cols; c++) {
      const cell = row[c] || "";
      colWidths[c] = Math.max(colWidths[c], cell.length);
    }
  }

  const padCell = (text: string, width: number, align: Alignment): string => {
    const t = text || "";
    const pad = width - t.length;
    if (pad <= 0) return t;
    if (align === "center") {
      const left = Math.floor(pad / 2);
      const right = pad - left;
      return " ".repeat(left) + t + " ".repeat(right);
    }
    if (align === "right") {
      return " ".repeat(pad) + t;
    }
    return t + " ".repeat(pad);
  };

  const makeSeparator = (align: Alignment, width: number): string => {
    const dashes = "-".repeat(Math.max(width, 3));
    if (align === "center") return `:${dashes.slice(1, -1)}:`;
    if (align === "right") return `${dashes.slice(0, -1)}:`;
    return `:${dashes.slice(1)}`;
  };

  // Header row
  const headerLine =
    "| " +
    headers
      .map((h, i) => padCell(h, colWidths[i], alignments[i]))
      .join(" | ") +
    " |";

  // Separator row
  const sepLine =
    "| " +
    alignments
      .map((a, i) => makeSeparator(a, colWidths[i]))
      .join(" | ") +
    " |";

  // Body rows
  const bodyLines = bodyRows.map(
    (row) =>
      "| " +
      row
        .map((cell, i) => padCell(cell, colWidths[i], alignments[i]))
        .join(" | ") +
      " |"
  );

  return [headerLine, sepLine, ...bodyLines].join("\n");
}

function parseCSV(csv: string): string[][] {
  if (!csv.trim()) return [];

  const lines: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < csv.length) {
    const ch = csv[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < csv.length && csv[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        field += ch;
        i++;
        continue;
      }
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (ch === ",") {
      current.push(field);
      field = "";
      i++;
      continue;
    }

    if (ch === "\r") {
      if (i + 1 < csv.length && csv[i + 1] === "\n") i++;
      current.push(field);
      field = "";
      lines.push(current);
      current = [];
      i++;
      continue;
    }

    if (ch === "\n") {
      current.push(field);
      field = "";
      lines.push(current);
      current = [];
      i++;
      continue;
    }

    field += ch;
    i++;
  }

  current.push(field);
  if (current.some((c) => c !== "")) lines.push(current);

  if (lines.length === 0) return [];

  // Normalize column count
  const maxCols = Math.max(...lines.map((l) => l.length));
  return lines.map((row) => {
    while (row.length < maxCols) row.push("");
    return row;
  });
}

/* ---------- Component ---------- */

export default function MarkdownTablePage() {
  const [data, setData] = useState<string[][]>(() => {
    const { data: d } = createEmptyGrid(4, 3);
    return d;
  });
  const [alignments, setAlignments] = useState<Alignment[]>(() =>
    Array(3).fill("left" as Alignment)
  );
  const [csvInput, setCsvInput] = useState("");
  const [showCsvImport, setShowCsvImport] = useState(false);

  const rows = data.length;
  const cols = data[0]?.length || 0;

  const markdown = useMemo(() => generateMarkdown(data, alignments), [data, alignments]);

  const updateCell = useCallback(
    (r: number, c: number, value: string) => {
      setData((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = value;
        return next;
      });
    },
    []
  );

  const addRow = useCallback(() => {
    setData((prev) => [...prev, Array(prev[0]?.length || 1).fill("")]);
  }, []);

  const addColumn = useCallback(() => {
    setData((prev) => prev.map((row) => [...row, ""]));
    setAlignments((prev) => [...prev, "left"]);
  }, []);

  const deleteRow = useCallback(
    (index: number) => {
      if (data.length <= 1) return; // Keep at least header row
      setData((prev) => prev.filter((_, i) => i !== index));
    },
    [data.length]
  );

  const deleteColumn = useCallback(
    (index: number) => {
      if (cols <= 1) return; // Keep at least one column
      setData((prev) => prev.map((row) => row.filter((_, i) => i !== index)));
      setAlignments((prev) => prev.filter((_, i) => i !== index));
    },
    [cols]
  );

  const setAlignment = useCallback((colIndex: number, align: Alignment) => {
    setAlignments((prev) => {
      const next = [...prev];
      next[colIndex] = align;
      return next;
    });
  }, []);

  const handleSetRowsCols = useCallback(
    (newRows: number, newCols: number) => {
      if (newRows < 1) newRows = 1;
      if (newCols < 1) newCols = 1;
      if (newRows > 50) newRows = 50;
      if (newCols > 20) newCols = 20;

      setData((prev) => {
        const result: string[][] = [];
        for (let r = 0; r < newRows; r++) {
          const row: string[] = [];
          for (let c = 0; c < newCols; c++) {
            row.push(prev[r]?.[c] ?? "");
          }
          result.push(row);
        }
        return result;
      });

      setAlignments((prev) => {
        const result: Alignment[] = [];
        for (let c = 0; c < newCols; c++) {
          result.push(prev[c] ?? "left");
        }
        return result;
      });
    },
    []
  );

  const loadSample = useCallback(() => {
    const newData = [SAMPLE_HEADERS, ...SAMPLE_ROWS];
    setData(newData);
    setAlignments([...SAMPLE_ALIGNMENTS]);
  }, []);

  const importCSV = useCallback(() => {
    const parsed = parseCSV(csvInput);
    if (parsed.length === 0) return;
    setData(parsed);
    setAlignments(Array(parsed[0].length).fill("left" as Alignment));
    setShowCsvImport(false);
    setCsvInput("");
  }, [csvInput]);

  const clearTable = useCallback(() => {
    const { data: d, alignments: a } = createEmptyGrid(4, 3);
    setData(d);
    setAlignments(a);
  }, []);

  const alignmentLabel: Record<Alignment, string> = {
    left: "L",
    center: "C",
    right: "R",
  };

  const nextAlignment: Record<Alignment, Alignment> = {
    left: "center",
    center: "right",
    right: "left",
  };

  return (
    <ToolLayout
      title="Markdown Table Generator"
      description="Generate formatted Markdown tables with a visual editor. Supports column alignment, CSV import, and live preview."
      slug="markdown-table"
    >
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-[var(--muted-foreground)]">Rows:</span>
          <input
            type="number"
            min={1}
            max={50}
            value={rows}
            onChange={(e) => handleSetRowsCols(Number(e.target.value), cols)}
            className="w-16 rounded-md border border-[var(--border)] px-2 py-1 text-sm text-center"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-[var(--muted-foreground)]">Cols:</span>
          <input
            type="number"
            min={1}
            max={20}
            value={cols}
            onChange={(e) => handleSetRowsCols(rows, Number(e.target.value))}
            className="w-16 rounded-md border border-[var(--border)] px-2 py-1 text-sm text-center"
          />
        </label>

        <button
          onClick={addRow}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
        >
          + Row
        </button>
        <button
          onClick={addColumn}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
        >
          + Column
        </button>

        <button
          onClick={loadSample}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
        >
          Load Sample
        </button>
        <button
          onClick={() => setShowCsvImport(!showCsvImport)}
          className={`rounded-md border px-3 py-1 text-xs font-medium btn-press ${
            showCsvImport
              ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
              : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
          }`}
        >
          Import CSV
        </button>
        <button
          onClick={clearTable}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
        >
          Clear
        </button>
      </div>

      {/* CSV Import */}
      {showCsvImport && (
        <div className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
          <label className="mb-1 block text-sm font-medium">
            Paste CSV Data
          </label>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder="Header1,Header2,Header3&#10;Cell1,Cell2,Cell3&#10;Cell4,Cell5,Cell6"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm font-mono"
            rows={5}
            spellCheck={false}
          />
          <button
            onClick={importCSV}
            disabled={!csvInput.trim()}
            className="mt-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 btn-press"
          >
            Import
          </button>
        </div>
      )}

      {/* Table editor */}
      <div className="overflow-auto">
        <table className="text-sm">
          <thead>
            {/* Alignment controls row */}
            <tr>
              <th className="p-1" /> {/* spacer for row delete buttons */}
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} className="p-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() =>
                        setAlignment(c, nextAlignment[alignments[c]])
                      }
                      className="rounded border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-xs font-mono hover:bg-[var(--muted)] btn-press"
                      title={`Alignment: ${alignments[c]}`}
                    >
                      {alignmentLabel[alignments[c]]}
                    </button>
                    {cols > 1 && (
                      <button
                        onClick={() => deleteColumn(c)}
                        className="rounded border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 text-xs text-[var(--destructive)] hover:bg-[var(--destructive)]/10 btn-press"
                        title="Delete column"
                      >
                        x
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, r) => (
              <tr key={r}>
                <td className="p-1 align-middle">
                  {data.length > 1 && (
                    <button
                      onClick={() => deleteRow(r)}
                      className="rounded border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 text-xs text-[var(--destructive)] hover:bg-[var(--destructive)]/10 btn-press"
                      title={r === 0 ? "Delete header row" : "Delete row"}
                    >
                      x
                    </button>
                  )}
                </td>
                {row.map((cell, c) => (
                  <td key={c} className="p-1">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                      placeholder={r === 0 ? `Header ${c + 1}` : ""}
                      className={`w-full min-w-[100px] rounded-md border border-[var(--border)] px-2 py-1.5 text-sm ${
                        r === 0 ? "font-semibold bg-[var(--muted)]" : ""
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live preview */}
      {data.length > 1 && data[0].some((h) => h.trim()) && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium">Preview</h3>
          <div className="overflow-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                  {data[0].map((header, c) => (
                    <th
                      key={c}
                      className={`px-4 py-2 font-medium ${
                        alignments[c] === "center"
                          ? "text-center"
                          : alignments[c] === "right"
                            ? "text-right"
                            : "text-left"
                      }`}
                    >
                      {header || `Column ${c + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(1).map((row, r) => (
                  <tr
                    key={r}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`px-4 py-2 ${
                          alignments[c] === "center"
                            ? "text-center"
                            : alignments[c] === "right"
                              ? "text-right"
                              : "text-left"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Markdown output */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium">Markdown Output</h3>
          {markdown && <CopyButton text={markdown} />}
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre">
          {markdown || "Edit the table above to generate Markdown..."}
        </pre>
      </div>
    </ToolLayout>
  );
}
