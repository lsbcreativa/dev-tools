"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function beautifyJS(code: string, indentSize: number): string {
  const indent = " ".repeat(indentSize);
  let result = "";
  let depth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;
  let i = 0;

  const addNewline = () => {
    result = result.trimEnd();
    result += "\n" + indent.repeat(depth);
  };

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];

    // Handle string states
    if (inLineComment) {
      result += ch;
      if (ch === "\n") {
        inLineComment = false;
        result += indent.repeat(depth);
      }
      i++;
      continue;
    }

    if (inBlockComment) {
      result += ch;
      if (ch === "*" && next === "/") {
        result += "/";
        inBlockComment = false;
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    if (inSingleQuote) {
      result += ch;
      if (ch === "\\" && i + 1 < code.length) {
        result += next;
        i += 2;
        continue;
      }
      if (ch === "'") inSingleQuote = false;
      i++;
      continue;
    }

    if (inDoubleQuote) {
      result += ch;
      if (ch === "\\" && i + 1 < code.length) {
        result += next;
        i += 2;
        continue;
      }
      if (ch === '"') inDoubleQuote = false;
      i++;
      continue;
    }

    if (inBacktick) {
      result += ch;
      if (ch === "\\" && i + 1 < code.length) {
        result += next;
        i += 2;
        continue;
      }
      if (ch === "`") inBacktick = false;
      i++;
      continue;
    }

    // Enter string states
    if (ch === "'") { inSingleQuote = true; result += ch; i++; continue; }
    if (ch === '"') { inDoubleQuote = true; result += ch; i++; continue; }
    if (ch === "`") { inBacktick = true; result += ch; i++; continue; }

    // Enter comment states
    if (ch === "/" && next === "/") {
      inLineComment = true;
      result += "//";
      i += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      result += "/*";
      i += 2;
      continue;
    }

    // Opening brackets
    if (ch === "{" || ch === "[") {
      result += ch;
      depth++;
      addNewline();
      i++;
      continue;
    }

    // Closing brackets
    if (ch === "}" || ch === "]") {
      depth = Math.max(0, depth - 1);
      addNewline();
      result += ch;
      i++;
      continue;
    }

    // Semicolons
    if (ch === ";") {
      result += ch;
      // Only add newline if not inside a for loop parentheses
      const beforeSemi = result.trimEnd();
      const parenBalance = (beforeSemi.match(/\(/g) || []).length - (beforeSemi.match(/\)/g) || []).length;
      if (parenBalance <= 0) {
        addNewline();
      }
      i++;
      continue;
    }

    // Commas
    if (ch === ",") {
      result += ch;
      addNewline();
      i++;
      continue;
    }

    // Collapse multiple whitespace to single space (outside strings)
    if (/\s/.test(ch)) {
      if (result.length > 0 && !/\s/.test(result[result.length - 1])) {
        result += " ";
      }
      i++;
      continue;
    }

    result += ch;
    i++;
  }

  // Clean up extra blank lines
  return result
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function minifyJS(code: string): string {
  let result = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;
  let i = 0;

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      i++;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    if (inSingleQuote) {
      result += ch;
      if (ch === "\\" && i + 1 < code.length) { result += next; i += 2; continue; }
      if (ch === "'") inSingleQuote = false;
      i++;
      continue;
    }

    if (inDoubleQuote) {
      result += ch;
      if (ch === "\\" && i + 1 < code.length) { result += next; i += 2; continue; }
      if (ch === '"') inDoubleQuote = false;
      i++;
      continue;
    }

    if (inBacktick) {
      result += ch;
      if (ch === "\\" && i + 1 < code.length) { result += next; i += 2; continue; }
      if (ch === "`") inBacktick = false;
      i++;
      continue;
    }

    // Comments
    if (ch === "/" && next === "/") { inLineComment = true; i += 2; continue; }
    if (ch === "/" && next === "*") { inBlockComment = true; i += 2; continue; }

    // Strings
    if (ch === "'") { inSingleQuote = true; result += ch; i++; continue; }
    if (ch === '"') { inDoubleQuote = true; result += ch; i++; continue; }
    if (ch === "`") { inBacktick = true; result += ch; i++; continue; }

    // Collapse whitespace
    if (/\s/.test(ch)) {
      // Keep one space if between alphanumeric/underscore characters
      const prev = result[result.length - 1];
      if (prev && /[a-zA-Z0-9_$]/.test(prev)) {
        // Look ahead to next non-whitespace
        let j = i + 1;
        while (j < code.length && /\s/.test(code[j])) j++;
        if (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) {
          result += " ";
        }
      }
      i++;
      continue;
    }

    result += ch;
    i++;
  }

  return result.trim();
}

export default function JsFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const handleBeautify = () => {
    if (!input.trim()) {
      setError("Please enter JavaScript code to beautify.");
      setOutput("");
      return;
    }
    try {
      setError("");
      setOutput(beautifyJS(input, indent));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setError("Please enter JavaScript code to minify.");
      setOutput("");
      return;
    }
    try {
      setError("");
      setOutput(minifyJS(input));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <ToolLayout
      title="JS Beautifier / Minifier"
      description="Beautify or minify JavaScript code with configurable indentation."
      slug="js-formatter"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Input JavaScript</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'function hello(name){const greeting="Hello, "+name+"!";console.log(greeting);return greeting;}'}
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={8}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleBeautify}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Beautify
        </button>
        <button
          onClick={handleMinify}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
        >
          Minify
        </button>
        <label className="flex items-center gap-2 text-sm ml-auto">
          Indent:
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded border border-[var(--border)] px-2 py-1 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </label>
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
