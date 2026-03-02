"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

function escapeCsvField(field: string): string {
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function jsonToCsv(jsonStr: string): string {
  const data = JSON.parse(jsonStr);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Input must be a non-empty JSON array of objects.");
  }

  const headers = Array.from(
    new Set(data.flatMap((obj: Record<string, unknown>) => Object.keys(obj)))
  );

  const headerRow = headers.map(escapeCsvField).join(",");
  const rows = data.map((obj: Record<string, unknown>) =>
    headers.map((h) => escapeCsvField(obj[h] !== undefined ? String(obj[h]) : "")).join(",")
  );

  return [headerRow, ...rows].join("\n");
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function csvToJson(csvStr: string): string {
  const lines = csvStr.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row.");
  }

  const headers = parseCsvLine(lines[0]);
  const result = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i] !== undefined ? values[i] : "";
    });
    return obj;
  });

  return JSON.stringify(result, null, 2);
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function JsonCsvTool() {
  const [mode, setMode] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    setOutput("");

    if (!input.trim()) {
      setError("Please enter some input to convert.");
      return;
    }

    try {
      if (mode === "json-to-csv") {
        setOutput(jsonToCsv(input));
      } else {
        setOutput(csvToJson(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed. Check your input format.");
    }
  };

  const handleDownload = () => {
    if (!output) return;
    if (mode === "json-to-csv") {
      downloadFile(output, "data.csv", "text/csv");
    } else {
      downloadFile(output, "data.json", "application/json");
    }
  };

  const faqs = [
    {
      question: "Can I convert nested JSON to CSV?",
      answer: "CSV is a flat format and cannot represent nested structures directly. Nested objects are typically flattened (parent.child notation) or serialized as JSON strings within CSV cells. For deeply nested data, JSON is the better format.",
    },
    {
      question: "How are special characters handled in CSV?",
      answer: "Values containing commas, quotes, or newlines are wrapped in double quotes. Double quotes within values are escaped by doubling them (\"\"). This follows the RFC 4180 CSV standard.",
    },
    {
      question: "What if my JSON objects have different keys?",
      answer: "The tool uses the keys from the first object as column headers. Objects missing a key will have an empty cell for that column. Extra keys in subsequent objects may be ignored.",
    },
  ];

  return (
    <ToolLayout
      title="JSON to CSV Converter"
      description="Convert between JSON arrays and CSV data. Download results as files."
      slug="json-csv"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert Between JSON and CSV",
              content: "Paste JSON array data or CSV text and convert between formats instantly. For JSON to CSV, the tool extracts keys from the first object as column headers and maps values to rows. For CSV to JSON, each row becomes an object with column headers as keys. You can download the result as a .csv or .json file.",
            },
            {
              title: "JSON vs CSV: When to Use Each Format",
              content: "CSV (Comma-Separated Values) is ideal for tabular data \u2014 spreadsheets, database exports, and data analysis in tools like Excel, Google Sheets, and Pandas. JSON (JavaScript Object Notation) is preferred for APIs, nested data structures, and web applications. CSV is smaller and faster to parse for flat data, while JSON supports nested objects, arrays, and mixed types that CSV cannot represent.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode("json-to-csv"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "json-to-csv"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          JSON &rarr; CSV
        </button>
        <button
          onClick={() => { setMode("csv-to-json"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "csv-to-json"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          CSV &rarr; JSON
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {mode === "json-to-csv" ? "JSON Input" : "CSV Input"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "json-to-csv"
              ? '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
              : "name,age\nAlice,30\nBob,25"
          }
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={6}
        />
      </div>

      <button
        onClick={handleConvert}
        className="mt-3 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
      >
        Convert
      </button>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {output && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {mode === "json-to-csv" ? "CSV Output" : "JSON Output"}
            </span>
            <div className="flex gap-2">
              <CopyButton text={output} />
              <button
                onClick={handleDownload}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
              >
                Download
              </button>
            </div>
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
