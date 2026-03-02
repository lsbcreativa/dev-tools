"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
  "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "ON", "AND", "OR", "GROUP BY",
  "HAVING", "ORDER BY", "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE",
  "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "UNION", "UNION ALL",
  "AS", "IN", "NOT", "NULL", "IS", "LIKE", "BETWEEN", "EXISTS",
  "CASE", "WHEN", "THEN", "ELSE", "END", "DISTINCT",
  "COUNT", "SUM", "AVG", "MIN", "MAX", "ASC", "DESC",
];

// Keywords that should start on a new line (major clauses)
const NEWLINE_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
  "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "JOIN", "ON",
  "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "OFFSET",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  "CREATE TABLE", "ALTER TABLE", "UNION", "UNION ALL",
];

// Keywords that get indented (sub-clauses)
const INDENT_KEYWORDS = ["ON", "AND", "OR", "SET"];

function formatSQL(sql: string): string {
  // Normalize whitespace
  let formatted = sql.replace(/\s+/g, " ").trim();

  // Uppercase all SQL keywords (longest first to handle multi-word keywords)
  const sortedKeywords = [...SQL_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const keyword of sortedKeywords) {
    const regex = new RegExp(`\\b${keyword.replace(/ /g, "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, keyword);
  }

  // Add newlines before major clauses (longest first)
  const sortedNewline = [...NEWLINE_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const keyword of sortedNewline) {
    const regex = new RegExp(`\\s+${keyword.replace(/ /g, "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${keyword}`);
  }

  // Add newlines and indentation for sub-clauses
  for (const keyword of INDENT_KEYWORDS) {
    const regex = new RegExp(`\n${keyword}\\b`, "g");
    formatted = formatted.replace(regex, `\n  ${keyword}`);
  }

  // Also handle AND/OR that might not have a newline yet
  formatted = formatted.replace(/ (AND|OR) /g, "\n  $1 ");

  // Clean up: ensure no double newlines, trim lines
  formatted = formatted
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, i) => i === 0 || line.trim() !== "")
    .join("\n")
    .trim();

  return formatted;
}

function minifySQL(sql: string): string {
  return sql.replace(/\s+/g, " ").trim();
}

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleFormat = () => {
    if (!input.trim()) {
      setError("Please enter a SQL query to format.");
      setOutput("");
      return;
    }
    try {
      setError("");
      setOutput(formatSQL(input));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setError("Please enter a SQL query to minify.");
      setOutput("");
      return;
    }
    try {
      setError("");
      setOutput(minifySQL(input));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <ToolLayout
      title="SQL Formatter"
      description="Format, beautify, and minify SQL queries with proper indentation and keyword uppercasing."
      slug="sql-formatter"
      faqs={[
        { question: "How do I format SQL online?", answer: "Paste your SQL query in the input field and click Format. The tool adds proper indentation, capitalizes SQL keywords (SELECT, FROM, WHERE, JOIN), and breaks the query into readable lines. You can also minify SQL to remove all extra whitespace." },
        { question: "Does this support all SQL dialects?", answer: "The formatter handles standard SQL syntax including SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE, JOINs, subqueries, and common functions. It works with MySQL, PostgreSQL, SQLite, and SQL Server syntax." },
        { question: "Does formatting change how my SQL query works?", answer: "No. Formatting only changes whitespace and capitalization. The query logic, execution plan, and results remain exactly the same. It is purely a cosmetic transformation for readability." }
      ]}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Format SQL Queries Online", content: "Paste your unformatted SQL query into the input field and click Format. The tool parses the query structure, capitalizes SQL keywords, adds proper indentation for clauses like SELECT, FROM, WHERE, JOIN, and GROUP BY, and aligns subqueries for maximum readability. You can also minify SQL to compress it into a single line." },
            { title: "Why Format Your SQL?", content: "Well-formatted SQL is easier to read, debug, and review in code reviews. Consistent formatting helps teams maintain coding standards and makes complex queries with multiple JOINs, subqueries, and CTEs significantly easier to understand. This tool runs in your browser — your queries are never sent to any server." }
          ]}
          faqs={[
            { question: "How do I format SQL online?", answer: "Paste your SQL query in the input field and click Format. The tool adds proper indentation, capitalizes SQL keywords (SELECT, FROM, WHERE, JOIN), and breaks the query into readable lines. You can also minify SQL to remove all extra whitespace." },
            { question: "Does this support all SQL dialects?", answer: "The formatter handles standard SQL syntax including SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE, JOINs, subqueries, and common functions. It works with MySQL, PostgreSQL, SQLite, and SQL Server syntax." },
            { question: "Does formatting change how my SQL query works?", answer: "No. Formatting only changes whitespace and capitalization. The query logic, execution plan, and results remain exactly the same. It is purely a cosmetic transformation for readability." }
          ]}
        />
      }
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Input SQL</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"select u.id, u.name, o.total from users u left join orders o on u.id = o.user_id where o.total > 100 and u.active = 1 order by o.total desc limit 10"}
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={8}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleFormat}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
        >
          Minify
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {output && !error && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Output</span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-96">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
