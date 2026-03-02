"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

interface SheetData {
  name: string;
  headers: string[];
  rows: string[][];
}

export default function ExcelViewer() {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [fileName, setFileName] = useState("");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    setError("");
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Please select an Excel file (.xlsx).");
      return;
    }
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const parsed: SheetData[] = [];
      workbook.eachSheet((ws) => {
        const headers: string[] = [];
        const rows: string[][] = [];
        ws.eachRow((row, rowNum) => {
          const cells = row.values as (string | number | boolean | null | undefined)[];
          const vals = cells.slice(1).map((c) => (c != null ? String(c) : ""));
          if (rowNum === 1) {
            headers.push(...vals);
          } else {
            // Pad to header length
            while (vals.length < headers.length) vals.push("");
            rows.push(vals.slice(0, headers.length));
          }
        });
        if (headers.length > 0) {
          parsed.push({ name: ws.name, headers, rows });
        }
      });

      if (parsed.length === 0) {
        setError("No data found in the Excel file.");
        return;
      }

      setSheets(parsed);
      setActiveSheet(0);
      setFileName(file.name);
      setSearch("");
      setSortCol(null);
    } catch {
      setError("Failed to read Excel file. It may be corrupted or password-protected.");
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colIndex);
      setSortAsc(true);
    }
  };

  const sheet = sheets[activeSheet];
  const filteredRows = sheet
    ? sheet.rows
        .filter((row) => !search || row.some((cell) => cell.toLowerCase().includes(search.toLowerCase())))
        .sort((a, b) => {
          if (sortCol === null) return 0;
          const va = a[sortCol] || "";
          const vb = b[sortCol] || "";
          const na = Number(va), nb = Number(vb);
          if (!isNaN(na) && !isNaN(nb)) return sortAsc ? na - nb : nb - na;
          return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        })
    : [];

  const faqs = [
    {
      question: "What file formats are supported?",
      answer: "This tool supports .xlsx files (Excel 2007 and later format). For older .xls files, convert them to .xlsx first using any spreadsheet application or online converter.",
    },
    {
      question: "Can I edit the Excel file?",
      answer: "This is a viewer tool — you can browse, sort, and search data but not modify cells. For editing, use the CSV Viewer tool (export to CSV first) or a full spreadsheet application.",
    },
    {
      question: "Is my file uploaded to any server?",
      answer: "No. The file is processed entirely in your browser using JavaScript. Your Excel data never leaves your device.",
    },
  ];

  return (
    <ToolLayout
      title="Excel Viewer"
      description="Open and view Excel (.xlsx) files in your browser. Browse sheets, sort columns, and search data."
      slug="excel-viewer"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to View Excel Files Online",
              content: "Upload an .xlsx file to browse its contents directly in your browser. Navigate between sheets, sort columns by clicking headers, and search for specific values. The viewer handles formatted cells, multiple sheets, and large datasets without requiring Microsoft Excel or any spreadsheet software installed.",
            },
            {
              title: "Open Excel Files Without Excel",
              content: "Not everyone has Microsoft Excel installed, and online alternatives like Google Sheets require uploading files to the cloud. This tool opens .xlsx files entirely in your browser — your data stays on your device. It's perfect for quickly inspecting Excel files on any computer, reviewing shared spreadsheets, and checking data before importing into other systems.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {sheets.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
            dragging
              ? "border-[var(--primary)] bg-[var(--primary)]/5"
              : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
            className="hidden"
          />
          <p className="text-sm font-medium">Click or drag & drop an Excel file</p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Supports .xlsx files</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* File info + change */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">{fileName}</span>
              <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                {sheets.length} sheet{sheets.length > 1 ? "s" : ""} — {filteredRows.length} rows
              </span>
            </div>
            <button
              onClick={() => { setSheets([]); setFileName(""); }}
              className="text-xs text-[var(--destructive)] hover:underline"
            >
              Change file
            </button>
          </div>

          {/* Sheet tabs */}
          {sheets.length > 1 && (
            <div className="flex gap-1 overflow-x-auto">
              {sheets.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveSheet(i); setSortCol(null); setSearch(""); }}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors btn-press ${
                    activeSheet === i
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all cells..."
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />

          {/* Table */}
          {sheet && (
            <div className="overflow-auto rounded-lg border border-[var(--border)] max-h-[500px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[var(--muted)]">
                  <tr>
                    {sheet.headers.map((h, i) => (
                      <th
                        key={i}
                        onClick={() => handleSort(i)}
                        className="cursor-pointer border-b border-[var(--border)] px-3 py-2 text-left text-xs font-medium hover:bg-[var(--muted)]/80 whitespace-nowrap select-none"
                      >
                        {h}
                        {sortCol === i && (
                          <span className="ml-1">{sortAsc ? "▲" : "▼"}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/30">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-1.5 whitespace-nowrap text-xs">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}
    </ToolLayout>
  );
}
