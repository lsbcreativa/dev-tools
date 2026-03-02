"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "text-orange-600 dark:text-orange-400"; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-blue-600 dark:text-blue-400 font-medium"; // key
        } else {
          cls = "text-green-600 dark:text-green-400"; // string
        }
      } else if (/true|false/.test(match)) {
        cls = "text-purple-600 dark:text-purple-400"; // boolean
      } else if (/null/.test(match)) {
        cls = "text-red-500 dark:text-red-400"; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [highlighted, setHighlighted] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setHighlighted(syntaxHighlight(formatted));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
      setHighlighted("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      const min = JSON.stringify(parsed);
      setOutput(min);
      setHighlighted(syntaxHighlight(min));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
      setHighlighted("");
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setError("");
      setOutput("Valid JSON!");
      setHighlighted("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
      setHighlighted("");
    }
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate and minify JSON data with proper indentation."
      slug="json-formatter"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Input JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "name": "DevTools",\n  "version": 1,\n  "features": ["format", "validate", "minify"],\n  "isAwesome": true\n}'}
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={8}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={format} className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press">
          Format
        </button>
        <button onClick={minify} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press">
          Minify
        </button>
        <button onClick={validate} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press">
          Validate
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
            <span className="text-sm font-medium">
              {output === "Valid JSON!" ? (
                <span className="text-[var(--success)] flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Valid JSON
                </span>
              ) : (
                "Output"
              )}
            </span>
            {output !== "Valid JSON!" && <CopyButton text={output} />}
          </div>
          {highlighted ? (
            <pre
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-96"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          ) : output === "Valid JSON!" ? null : (
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-96">
              {output}
            </pre>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
