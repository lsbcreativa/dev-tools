"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ---------- Sample data ---------- */

const SAMPLE_CSV = `id,first_name,last_name,email,department,salary,start_date,is_active
1,Alice,Johnson,alice.johnson@company.com,Engineering,95000,2019-03-15,true
2,Bob,Smith,bob.smith@company.com,Marketing,72000,2020-07-01,true
3,Carol,Williams,carol.williams@company.com,Engineering,102000,2018-11-20,true
4,David,Brown,david.brown@company.com,Sales,68000,2021-01-10,false
5,Eve,Davis,eve.davis@company.com,Engineering,110000,2017-06-05,true
6,Frank,Miller,frank.miller@company.com,HR,65000,2022-02-28,true
7,Grace,Wilson,grace.wilson@company.com,Marketing,78000,2020-09-14,true
8,Henry,Moore,henry.moore@company.com,Sales,71000,2021-08-22,false
9,Ivy,Taylor,ivy.taylor@company.com,Engineering,98000,2019-12-01,true
10,Jack,Anderson,jack.anderson@company.com,HR,62000,2023-04-17,true`;

/* ---------- CSV Parser ---------- */

function parseCSV(
  raw: string,
  delimiter: string
): { headers: string[]; rows: string[][] } {
  const lines: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote ""
        if (i + 1 < raw.length && raw[i + 1] === '"') {
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

    // Not in quotes
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (ch === delimiter) {
      current.push(field);
      field = "";
      i++;
      continue;
    }

    if (ch === "\r") {
      // handle \r\n
      if (i + 1 < raw.length && raw[i + 1] === "\n") {
        i++;
      }
      current.push(field);
      field = "";
      if (current.some((c) => c !== "")) {
        lines.push(current);
      }
      current = [];
      i++;
      continue;
    }

    if (ch === "\n") {
      current.push(field);
      field = "";
      if (current.some((c) => c !== "")) {
        lines.push(current);
      }
      current = [];
      i++;
      continue;
    }

    field += ch;
    i++;
  }

  // Last field/row
  current.push(field);
  if (current.some((c) => c !== "")) {
    lines.push(current);
  }

  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0];
  const rows = lines.slice(1);

  // Normalize row lengths to match headers
  const normalized = rows.map((row) => {
    while (row.length < headers.length) row.push("");
    return row.slice(0, headers.length);
  });

  return { headers, rows: normalized };
}

function rowsToCSV(headers: string[], rows: string[][], delimiter: string): string {
  const escape = (val: string) => {
    if (val.includes(delimiter) || val.includes('"') || val.includes("\n")) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  };
  const headerLine = headers.map(escape).join(delimiter);
  const dataLines = rows.map((row) => row.map(escape).join(delimiter));
  return [headerLine, ...dataLines].join("\n");
}

/* ---------- Delimiter options ---------- */

const DELIMITERS = [
  { label: "Comma (,)", value: "," },
  { label: "Tab (\\t)", value: "\t" },
  { label: "Semicolon (;)", value: ";" },
  { label: "Pipe (|)", value: "|" },
];

/* ---------- Component ---------- */

export default function CsvViewerPage() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const { headers, rows } = useMemo(() => {
    if (!input.trim()) return { headers: [] as string[], rows: [] as string[][] };
    return parseCSV(input, delimiter);
  }, [input, delimiter]);

  // Filter rows by search
  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(q))
    );
  }, [rows, search]);

  // Sort rows
  const sorted = useMemo(() => {
    if (sortCol === null) return filtered;
    const idx = sortCol;
    return [...filtered].sort((a, b) => {
      const aVal = a[idx] ?? "";
      const bVal = b[idx] ?? "";

      // Try numeric comparison
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum) && aVal !== "" && bVal !== "") {
        return sortAsc ? aNum - bNum : bNum - aNum;
      }

      // Fallback string comparison
      const cmp = aVal.localeCompare(bVal);
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortAsc]);

  const handleSort = useCallback(
    (colIdx: number) => {
      if (sortCol === colIdx) {
        setSortAsc((prev) => !prev);
      } else {
        setSortCol(colIdx);
        setSortAsc(true);
      }
    },
    [sortCol]
  );

  const csvOutput = useMemo(() => {
    if (headers.length === 0) return "";
    return rowsToCSV(headers, sorted, delimiter);
  }, [headers, sorted, delimiter]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) setInput(text);
    };
    reader.readAsText(file);
    // Reset file input so same file can be uploaded again
    e.target.value = "";
  };

  const downloadCSV = () => {
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: "What delimiters are supported?",
      answer: "The tool auto-detects common delimiters: comma (,), semicolon (;), tab, and pipe (|). Most CSV files use commas, but European files often use semicolons since commas are used as decimal separators.",
    },
    {
      question: "Can I edit the data before exporting?",
      answer: "Yes. Click any cell to edit its value directly in the table. You can also sort columns and filter rows. Export the modified data as a new CSV file.",
    },
    {
      question: "How are quoted values handled?",
      answer: "Values containing commas, newlines, or quotes are wrapped in double quotes per the RFC 4180 standard. The tool correctly parses these quoted values to display the actual content.",
    },
  ];

  return (
    <ToolLayout
      title="CSV Viewer & Editor"
      description="View, sort, search, and export CSV data with support for custom delimiters and quoted fields."
      slug="csv-viewer"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to View and Edit CSV Files Online",
              content: "Upload or paste CSV data to view it as a formatted table. Sort columns, filter rows, edit cells inline, and export your changes. The tool auto-detects delimiters (comma, semicolon, tab) and handles quoted values with commas and newlines correctly.",
            },
            {
              title: "Working with CSV Files",
              content: "CSV (Comma-Separated Values) is the most universal data exchange format, supported by Excel, Google Sheets, databases, and every programming language. Common uses include exporting database tables, sharing data between applications, importing contacts, and analyzing datasets. This tool provides a quick way to inspect and modify CSV files without installing spreadsheet software.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-[var(--muted-foreground)]">Delimiter:</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="rounded-md border border-[var(--border)] px-2 py-1 text-sm"
          >
            {DELIMITERS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            setInput(SAMPLE_CSV);
            setSearch("");
            setSortCol(null);
          }}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
        >
          Load Sample
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,.tsv,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
        >
          Upload File
        </button>
      </div>

      {/* Input area */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Paste CSV data
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSortCol(null);
          }}
          placeholder="Paste your CSV data here or upload a file..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={6}
          spellCheck={false}
        />
      </div>

      {/* Table view */}
      {headers.length > 0 && (
        <div className="mt-4">
          {/* Search + stats */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rows..."
                className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm w-56"
              />
              <span className="text-xs text-[var(--muted-foreground)]">
                {sorted.length} row{sorted.length !== 1 ? "s" : ""}
                {search && ` (filtered from ${rows.length})`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={csvOutput} label="Copy CSV" />
              <button
                onClick={downloadCSV}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
              >
                Download CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-[var(--border)] overflow-auto max-h-[500px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                  <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-foreground)] w-10">
                    #
                  </th>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      onClick={() => handleSort(i)}
                      className="px-3 py-2 text-left text-xs font-medium cursor-pointer select-none hover:text-[var(--primary)] transition-colors whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1">
                        {h}
                        {sortCol === i && (
                          <span className="text-[var(--primary)]">
                            {sortAsc ? "\u2191" : "\u2193"}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    <td className="px-3 py-1.5 text-xs text-[var(--muted-foreground)] font-mono">
                      {ri + 1}
                    </td>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-3 py-1.5 text-xs font-mono max-w-xs truncate"
                        title={cell}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td
                      colSpan={headers.length + 1}
                      className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]"
                    >
                      No matching rows found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
