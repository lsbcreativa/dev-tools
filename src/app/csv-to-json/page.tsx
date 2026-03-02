"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_CSV = `id,name,age,email,active,salary
1,Alice Johnson,29,alice@example.com,true,75000
2,Bob Smith,34,bob@example.com,false,82000
3,"Carol, Jr.",27,carol@example.com,true,68500
4,Dave O'Brien,41,dave@example.com,true,95000
5,Eve Williams,31,"eve@example.com",false,71000`;

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
    i++;
  }
  fields.push(current);
  return fields;
}

function inferType(val: string): unknown {
  const trimmed = val.trim();
  if (trimmed === "") return null;
  if (trimmed.toLowerCase() === "true") return true;
  if (trimmed.toLowerCase() === "false") return false;
  if (trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "nil") return null;
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  return trimmed;
}

function csvToJson(
  csv: string,
  useHeaders: boolean,
  doInferTypes: boolean,
  outputFormat: "objects" | "arrays"
): { data: unknown[]; rows: number; cols: number } {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return { data: [], rows: 0, cols: 0 };

  const allRows = lines.map((line) => parseCsvLine(line));
  const cols = allRows[0].length;

  let headers: string[] = [];
  let dataRows = allRows;

  if (useHeaders && allRows.length > 0) {
    headers = allRows[0].map((h) => h.trim());
    dataRows = allRows.slice(1);
  }

  const data = dataRows.map((row) => {
    if (outputFormat === "arrays") {
      return doInferTypes ? row.map(inferType) : row;
    }
    const obj: Record<string, unknown> = {};
    row.forEach((cell, idx) => {
      const key = useHeaders && headers[idx] !== undefined ? headers[idx] : `column${idx + 1}`;
      obj[key] = doInferTypes ? inferType(cell) : cell;
    });
    return obj;
  });

  return { data, rows: dataRows.length, cols };
}

const faqs = [
  {
    question: "What is CSV?",
    answer:
      "CSV (Comma-Separated Values) is a plain text format used to store tabular data. Each line represents a row, and values within a row are separated by commas. CSV is widely supported by spreadsheet applications like Excel and Google Sheets, and is a common format for data exports from databases and APIs.",
  },
  {
    question: "How do CSV headers work in this converter?",
    answer:
      "When 'Use first row as headers' is enabled (the default), the first line of your CSV is treated as column names. Each subsequent row is converted to a JSON object where the keys are the header names. If disabled, columns are named column1, column2, etc. When outputting arrays of arrays, headers are included as the first array.",
  },
  {
    question: "What does type inference do?",
    answer:
      "Type inference automatically converts values from strings to their native types. For example, '123' becomes the number 123, 'true' becomes the boolean true, and 'null' becomes null. Without type inference, all values remain as strings. This is useful when importing data into JavaScript or databases that require typed values.",
  },
  {
    question: "How are special characters handled in CSV?",
    answer:
      "Fields containing commas, double quotes, or newlines must be wrapped in double quotes in CSV. A double quote inside a quoted field is escaped by doubling it (\"\"). This converter correctly handles these cases: 'John \"Johnny\" Doe' and 'New York, NY' will both be parsed correctly when properly quoted.",
  },
];

export default function CsvToJsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [useHeaders, setUseHeaders] = useState(true);
  const [inferTypes, setInferTypes] = useState(true);
  const [outputFormat, setOutputFormat] = useState<"objects" | "arrays">("objects");
  const [stats, setStats] = useState<{ rows: number; cols: number } | null>(null);

  const convert = () => {
    if (!input.trim()) return;
    try {
      const result = csvToJson(input, useHeaders, inferTypes, outputFormat);
      setOutput(JSON.stringify(result.data, null, 2));
      setStats({ rows: result.rows, cols: result.cols });
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse CSV");
      setOutput("");
      setStats(null);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="CSV to JSON Converter"
      description="Convert CSV files to JSON arrays online. Auto-detects headers and supports type inference."
      slug="csv-to-json"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert CSV to JSON Online",
              content:
                "Paste your CSV data into the input area above and click Convert. The tool parses each row, using the first row as header names by default, and outputs a JSON array of objects. You can toggle type inference to automatically convert numeric strings to numbers and 'true'/'false' to booleans. The output can be formatted as an array of objects (most common for APIs) or an array of arrays (for compact representation). No files are uploaded — all processing happens in your browser.",
            },
            {
              title: "CSV to JSON: Understanding the Conversion",
              content:
                "CSV is a flat, row-based format while JSON supports nested structures. This converter maps each CSV row to a JSON object, using header names as keys. For example, a CSV with columns 'name,age,city' and a row 'Alice,29,NYC' becomes {\"name\": \"Alice\", \"age\": 29, \"city\": \"NYC\"}. The converter handles complex CSV edge cases: quoted fields containing commas, escaped double quotes, and whitespace around values. Type inference further enhances the output by converting numeric and boolean values from strings to their native JSON types.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={convert}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 btn-press"
          >
            Convert to JSON
          </button>
          <button
            onClick={() => {
              setInput(SAMPLE_CSV);
              setOutput("");
              setError("");
              setStats(null);
            }}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Load Sample
          </button>
        </div>

        <div className="flex flex-wrap gap-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useHeaders}
              onChange={(e) => setUseHeaders(e.target.checked)}
              className="rounded"
            />
            Use first row as headers
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inferTypes}
              onChange={(e) => setInferTypes(e.target.checked)}
              className="rounded"
            />
            Type inference (numbers, booleans)
          </label>
          <label className="flex items-center gap-2 text-sm">
            Output format:
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as "objects" | "arrays")}
              className="rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-sm"
            >
              <option value="objects">Array of objects</option>
              <option value="arrays">Array of arrays</option>
            </select>
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">CSV Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"name,age,city\nAlice,29,New York\nBob,34,London"}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-mono"
            rows={8}
            style={{ resize: "vertical" }}
          />
        </div>

        {stats && (
          <div className="flex gap-4 text-xs text-[var(--muted-foreground)]">
            <span>{stats.rows} rows</span>
            <span>{stats.cols} columns</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {output && !error && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">JSON Output</span>
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
                >
                  Download .json
                </button>
              </div>
            </div>
            <pre className="max-h-96 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
