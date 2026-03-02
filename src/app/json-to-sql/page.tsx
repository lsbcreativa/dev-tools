"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 29,
    "salary": 75000.50,
    "active": true,
    "department": null
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "age": 34,
    "salary": 82000.00,
    "active": false,
    "department": "Engineering"
  },
  {
    "id": 3,
    "name": "Carol Williams",
    "email": "carol@example.com",
    "age": 27,
    "salary": 68500.75,
    "active": true,
    "department": "Design"
  }
]`;

type SqlDialect = "mysql" | "postgresql" | "sqlite";

function inferSqlType(value: unknown, dialect: SqlDialect): string {
  if (value === null || value === undefined) {
    return dialect === "mysql" ? "TEXT" : "TEXT";
  }
  if (typeof value === "boolean") {
    if (dialect === "sqlite") return "INTEGER";
    if (dialect === "mysql") return "TINYINT(1)";
    return "BOOLEAN";
  }
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return dialect === "mysql" ? "INT" : "INTEGER";
    }
    return dialect === "mysql" ? "DOUBLE" : "REAL";
  }
  if (typeof value === "string") {
    if (value.length > 255) return "TEXT";
    return dialect === "mysql" ? "VARCHAR(255)" : "TEXT";
  }
  return "TEXT";
}

function quoteIdentifier(name: string, dialect: SqlDialect): string {
  if (dialect === "mysql") return `\`${name}\``;
  return `"${name}"`;
}

function escapeSqlValue(value: unknown, dialect: SqlDialect): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") {
    if (dialect === "sqlite") return value ? "1" : "0";
    return value ? "TRUE" : "FALSE";
  }
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    const escaped = value.replace(/'/g, "''");
    return `'${escaped}'`;
  }
  return `'${String(value)}'`;
}

function jsonToSql(
  rows: Record<string, unknown>[],
  tableName: string,
  dialect: SqlDialect,
  includeCreate: boolean,
  includeInsert: boolean
): string {
  if (rows.length === 0) return "-- No data to convert";

  const firstRow = rows[0];
  const columns = Object.keys(firstRow);

  // Infer types from all rows (use the first non-null value for each column)
  const columnTypes: Record<string, string> = {};
  columns.forEach((col) => {
    for (const row of rows) {
      if (row[col] !== null && row[col] !== undefined) {
        columnTypes[col] = inferSqlType(row[col], dialect);
        break;
      }
    }
    if (!columnTypes[col]) {
      columnTypes[col] = "TEXT";
    }
  });

  const parts: string[] = [];
  const q = (name: string) => quoteIdentifier(name, dialect);
  const tbl = q(tableName);

  if (includeCreate) {
    const colDefs = columns.map((col) => `  ${q(col)} ${columnTypes[col]}`).join(",\n");
    let createStmt = `CREATE TABLE ${tbl} (\n${colDefs}\n)`;
    if (dialect === "mysql") createStmt += " ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    createStmt += ";";
    parts.push(createStmt);
  }

  if (includeInsert) {
    const colList = columns.map(q).join(", ");
    const insertRows = rows.map((row) => {
      const values = columns.map((col) => escapeSqlValue(row[col], dialect)).join(", ");
      return `INSERT INTO ${tbl} (${colList}) VALUES (${values});`;
    });
    if (parts.length > 0) parts.push("");
    parts.push(...insertRows);
  }

  return parts.join("\n");
}

const faqs = [
  {
    question: "How does JSON to SQL conversion work?",
    answer:
      "The converter reads your JSON array of objects, inspects the values in the first row to determine column names and data types, then generates SQL statements. Each JSON key becomes a column, and each object in the array becomes an INSERT row. Types are inferred: numbers become INT or FLOAT, strings become VARCHAR or TEXT, booleans become BOOLEAN (or TINYINT for MySQL), and null values result in TEXT columns with NULL values.",
  },
  {
    question: "Which SQL dialects are supported?",
    answer:
      "The converter supports MySQL, PostgreSQL, and SQLite. MySQL uses backtick identifiers and TINYINT(1) for booleans. PostgreSQL uses double-quoted identifiers and native BOOLEAN type. SQLite uses double-quoted identifiers and stores booleans as INTEGER (0 or 1). The CREATE TABLE syntax also differs slightly between dialects in terms of column type names.",
  },
  {
    question: "How are data types inferred from JSON?",
    answer:
      "JSON numbers without decimals become INT (or INTEGER), numbers with decimals become DOUBLE (or REAL), strings under 255 characters become VARCHAR(255) (or TEXT), longer strings become TEXT, booleans become BOOLEAN (dialect-specific), and null values default to TEXT. The type is inferred from the first non-null value found in each column across all rows.",
  },
  {
    question: "How do I import the generated SQL into a database?",
    answer:
      "For MySQL, use the mysql command-line client: mysql -u username -p database_name < file.sql, or paste into MySQL Workbench or phpMyAdmin. For PostgreSQL, use psql: psql -U username -d database_name -f file.sql, or use pgAdmin. For SQLite, use the sqlite3 CLI: sqlite3 mydb.db < file.sql. Make sure to run the CREATE TABLE statement before the INSERT statements.",
  },
];

export default function JsonToSqlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dialect, setDialect] = useState<SqlDialect>("mysql");
  const [tableName, setTableName] = useState("my_table");
  const [includeCreate, setIncludeCreate] = useState(true);
  const [includeInsert, setIncludeInsert] = useState(true);

  const convert = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        setError("Input must be a JSON array of objects (e.g. [{...}, {...}])");
        setOutput("");
        return;
      }
      if (parsed.length === 0) {
        setError("The JSON array is empty — add at least one object.");
        setOutput("");
        return;
      }
      const rows = parsed as Record<string, unknown>[];
      const sql = jsonToSql(rows, tableName || "my_table", dialect, includeCreate, includeInsert);
      setOutput(sql);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON input");
      setOutput("");
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName || "my_table"}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="JSON to SQL Converter"
      description="Convert JSON arrays to SQL CREATE TABLE and INSERT statements for MySQL, PostgreSQL, or SQLite."
      slug="json-to-sql"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert JSON to SQL",
              content:
                "Paste a JSON array of objects into the input field above. Each object should represent one database row, with consistent keys across all objects. Configure your target database dialect (MySQL, PostgreSQL, or SQLite), enter your desired table name, and choose whether to include CREATE TABLE and INSERT statements. Click Convert to generate the SQL. The output can be copied to clipboard or downloaded as a .sql file ready to import into your database.",
            },
            {
              title: "SQL Data Types for JSON Values",
              content:
                "JSON values map to SQL types as follows: JSON integers become INT (MySQL) or INTEGER (PostgreSQL/SQLite); JSON floats become DOUBLE (MySQL) or REAL (SQLite/PostgreSQL); JSON strings under 255 characters become VARCHAR(255) in MySQL or TEXT in PostgreSQL and SQLite; longer strings become TEXT; JSON booleans become BOOLEAN in PostgreSQL, TINYINT(1) in MySQL, and INTEGER in SQLite; JSON null values result in NULL being inserted regardless of column type. Type inference uses the first non-null value found in each column.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
              Database
            </label>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as SqlDialect)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
              Table Name
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="my_table"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="flex flex-col justify-end gap-2 pb-0.5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeCreate}
                onChange={(e) => setIncludeCreate(e.target.checked)}
                className="rounded"
              />
              Include CREATE TABLE
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeInsert}
                onChange={(e) => setIncludeInsert(e.target.checked)}
                className="rounded"
              />
              Include INSERT statements
            </label>
          </div>
          <div className="flex flex-col justify-end gap-2 pb-0.5">
            <button
              onClick={convert}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 btn-press"
            >
              Generate SQL
            </button>
            <button
              onClick={() => {
                setInput(SAMPLE_JSON);
                setOutput("");
                setError("");
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              Load Sample
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">JSON Input (array of objects)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'[\n  { "id": 1, "name": "Alice", "active": true },\n  { "id": 2, "name": "Bob", "active": false }\n]'}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-mono"
            rows={10}
            style={{ resize: "vertical" }}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {output && !error && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">SQL Output</span>
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
                >
                  Download .sql
                </button>
              </div>
            </div>
            <pre className="max-h-96 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono whitespace-pre">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
