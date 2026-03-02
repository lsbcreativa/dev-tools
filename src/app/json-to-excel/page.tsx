"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

const SAMPLE_JSON = `[
  { "name": "Alice", "age": 30, "email": "alice@example.com", "city": "New York" },
  { "name": "Bob", "age": 25, "email": "bob@example.com", "city": "London" },
  { "name": "Charlie", "age": 35, "email": "charlie@example.com", "city": "Tokyo" }
]`;

const SAMPLE_CSV = `name,age,email,city
Alice,30,alice@example.com,New York
Bob,25,bob@example.com,London
Charlie,35,charlie@example.com,Tokyo`;

type InputMode = "json" | "csv";

export default function JsonToExcel() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [mode, setMode] = useState<InputMode>("json");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const parseInput = (): Record<string, unknown>[] | null => {
    try {
      if (mode === "json") {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === "object") return [parsed];
        throw new Error("Input must be a JSON array or object.");
      } else {
        const lines = input.trim().split("\n");
        if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");
        const headers = lines[0].split(",").map((h) => h.trim());
        return lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => { obj[h] = values[i] || ""; });
          return obj;
        });
      }
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  };

  const exportExcel = async () => {
    setError("");
    const data = parseInput();
    if (!data || data.length === 0) {
      if (!error) setError("No data to export.");
      return;
    }
    setExporting(true);
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Sheet1");

      // Headers
      const headers = Object.keys(data[0]);
      sheet.addRow(headers);

      // Style header row
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
        cell.border = { bottom: { style: "thin" } };
      });

      // Data rows
      data.forEach((row) => {
        sheet.addRow(headers.map((h) => row[h] ?? ""));
      });

      // Auto-width
      sheet.columns.forEach((col) => {
        let maxLen = 10;
        col.eachCell?.({ includeEmpty: true }, (cell) => {
          const len = String(cell.value ?? "").length;
          if (len > maxLen) maxLen = len;
        });
        col.width = Math.min(maxLen + 2, 40);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to generate Excel file.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <ToolLayout
      title="JSON/CSV to Excel"
      description="Convert JSON or CSV data to a real .xlsx Excel file with formatted headers and auto-sized columns."
      slug="json-to-excel"
    >
      {/* Mode toggle */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => { setMode("json"); setInput(SAMPLE_JSON); setError(""); }}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors btn-press ${
            mode === "json" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
          }`}
        >
          JSON
        </button>
        <button
          onClick={() => { setMode("csv"); setInput(SAMPLE_CSV); setError(""); }}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors btn-press ${
            mode === "csv" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
          }`}
        >
          CSV
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {mode === "json" ? "JSON Array" : "CSV Data"}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={12}
          spellCheck={false}
          placeholder={mode === "json" ? '[{ "key": "value" }]' : "header1,header2\nval1,val2"}
        />
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      <button
        onClick={exportExcel}
        disabled={exporting || !input.trim()}
        className="mt-4 w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press disabled:opacity-50"
      >
        {exporting ? "Generating..." : "Download .xlsx"}
      </button>
    </ToolLayout>
  );
}
