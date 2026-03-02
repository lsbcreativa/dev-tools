"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_YAML = `name: DevTools Online
version: 2.0
features:
  - yaml-to-json
  - csv-to-json
  - json-formatter
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret
enabled: true
maxConnections: 100
description: "A free online developer toolbox"`;

function parseYamlValue(val: string): unknown {
  const trimmed = val.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null" || trimmed === "~") return null;
  if (trimmed === "") return null;
  // Quoted strings
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  // Numbers
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  return trimmed;
}

function yamlToJson(yaml: string): unknown {
  const lines = yaml.split("\n");

  interface StackEntry {
    indent: number;
    container: unknown[] | Record<string, unknown>;
    key: string | null;
  }

  // Returns the indent level (number of leading spaces)
  function getIndent(line: string): number {
    let i = 0;
    while (i < line.length && line[i] === " ") i++;
    return i;
  }

  // Strip inline comments (not inside quotes)
  function stripComment(line: string): string {
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === "'" && !inDouble) inSingle = !inSingle;
      else if (ch === '"' && !inSingle) inDouble = !inDouble;
      else if (ch === "#" && !inSingle && !inDouble) {
        return line.slice(0, i).trimEnd();
      }
    }
    return line;
  }

  // Build a clean list of [indent, content] pairs, skipping blank lines and comments
  const items: Array<{ indent: number; content: string }> = [];
  for (const rawLine of lines) {
    const stripped = stripComment(rawLine);
    const trimmed = stripped.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    items.push({ indent: getIndent(stripped), content: trimmed });
  }

  if (items.length === 0) return {};

  // Detect root type: if first non-empty item is a list item, root is array
  const firstContent = items[0].content;
  const rootIsArray = firstContent.startsWith("- ");

  const root: unknown = rootIsArray ? [] : {};
  const stack: StackEntry[] = [{ indent: -1, container: root as unknown[] | Record<string, unknown>, key: null }];

  function currentContainer(): unknown[] | Record<string, unknown> {
    return stack[stack.length - 1].container;
  }

  function assignValue(val: unknown): void {
    const top = stack[stack.length - 1];
    const c = top.container;
    if (Array.isArray(c)) {
      c.push(val);
    } else if (top.key !== null) {
      (c as Record<string, unknown>)[top.key] = val;
      top.key = null;
    }
  }

  for (let i = 0; i < items.length; i++) {
    const { indent, content } = items[i];

    // Pop stack entries that are deeper or equal indent (unless we're adding to them)
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    if (content.startsWith("- ")) {
      // List item with value
      const itemVal = content.slice(2).trim();

      // Make sure current container is an array; if not, create one and assign
      let arr = currentContainer();
      if (!Array.isArray(arr)) {
        const newArr: unknown[] = [];
        assignValue(newArr);
        stack.push({ indent, container: newArr, key: null });
        arr = newArr;
      }

      const parsedVal = parseYamlValue(itemVal);
      (arr as unknown[]).push(parsedVal);
    } else if (content === "-") {
      // List item that starts a block
      let arr = currentContainer();
      if (!Array.isArray(arr)) {
        const newArr: unknown[] = [];
        assignValue(newArr);
        stack.push({ indent, container: newArr, key: null });
        arr = newArr;
      }
      // Next items will push into this array
      // Look ahead: if next item is deeper, it's a nested object
      const nextIndent = i + 1 < items.length ? items[i + 1].indent : -1;
      if (nextIndent > indent) {
        const nextIsArray = i + 1 < items.length && items[i + 1].content.startsWith("- ");
        const nested: unknown = nextIsArray ? [] : {};
        (arr as unknown[]).push(nested);
        stack.push({ indent: nextIndent - 1, container: nested as unknown[] | Record<string, unknown>, key: null });
      }
    } else {
      // Key: value pair
      const colonIdx = content.indexOf(": ");
      const isKeyOnly = content.endsWith(":") && !content.startsWith('"') && !content.startsWith("'");

      if (colonIdx === -1 && !isKeyOnly) {
        // Plain scalar (shouldn't happen normally)
        assignValue(parseYamlValue(content));
        continue;
      }

      let key: string;
      let valueStr: string;

      if (isKeyOnly) {
        key = content.slice(0, -1).trim();
        valueStr = "";
      } else {
        key = content.slice(0, colonIdx).trim();
        valueStr = content.slice(colonIdx + 2).trim();
      }

      // Remove quotes from key
      if (
        (key.startsWith('"') && key.endsWith('"')) ||
        (key.startsWith("'") && key.endsWith("'"))
      ) {
        key = key.slice(1, -1);
      }

      const c = currentContainer();
      if (Array.isArray(c)) {
        // We're in an array context, this key:value is part of an object
        // Need to create an object entry
        const newObj: Record<string, unknown> = {};
        c.push(newObj);
        stack.push({ indent, container: newObj, key: null });
        const newC = newObj;

        if (valueStr === "" || valueStr === "|" || valueStr === ">") {
          // Block value: look at next lines
          const nextIndentLevel = i + 1 < items.length ? items[i + 1].indent : -1;
          if (nextIndentLevel > indent) {
            const nextIsArray = i + 1 < items.length && items[i + 1].content.startsWith("- ");
            const nested: unknown = nextIsArray ? [] : {};
            newC[key] = nested;
            stack.push({ indent, container: newC, key: null });
            stack.push({ indent: nextIndentLevel - 1, container: nested as unknown[] | Record<string, unknown>, key: null });
          } else {
            newC[key] = null;
          }
        } else {
          newC[key] = parseYamlValue(valueStr);
        }
      } else {
        const obj = c as Record<string, unknown>;

        if (valueStr === "" || valueStr === "|" || valueStr === ">") {
          // Nested block: look ahead
          const nextIdx = i + 1;
          if (nextIdx < items.length && items[nextIdx].indent > indent) {
            const nextIsArray = items[nextIdx].content.startsWith("- ");
            const nested: unknown = nextIsArray ? [] : {};
            obj[key] = nested;
            stack.push({ indent, container: obj, key: null });
            stack.push({ indent: items[nextIdx].indent - 1, container: nested as unknown[] | Record<string, unknown>, key: null });
          } else {
            obj[key] = null;
          }
        } else {
          obj[key] = parseYamlValue(valueStr);
        }
      }
    }
  }

  return root;
}

const faqs = [
  {
    question: "What is YAML?",
    answer:
      "YAML (YAML Ain't Markup Language) is a human-readable data serialization format commonly used for configuration files. It uses indentation to represent structure, making it easier to read than JSON or XML. YAML is used in tools like Docker Compose, Kubernetes, GitHub Actions, and Ansible.",
  },
  {
    question: "What are the key differences between YAML and JSON?",
    answer:
      "YAML uses indentation and colons for structure while JSON uses braces and brackets. YAML supports comments (# comment), multi-line strings, and anchors/aliases. JSON is more widely supported in programming languages and is generally safer to parse. JSON requires quotes around all string keys; YAML does not.",
  },
  {
    question: "When should I use YAML instead of JSON?",
    answer:
      "Use YAML for configuration files read by humans — it is more readable and supports comments. Use JSON for data interchange between applications, APIs, and when you need maximum compatibility. YAML is the standard for Kubernetes manifests, CI/CD pipelines, and application configuration. JSON is preferred for REST APIs and database storage.",
  },
  {
    question: "How do I convert YAML arrays to JSON?",
    answer:
      "YAML arrays use a dash prefix for each item (- item). When converted to JSON, each list becomes a JSON array []. For example, the YAML list 'colors:\\n  - red\\n  - blue' becomes {\"colors\": [\"red\", \"blue\"]} in JSON. This converter handles nested arrays and objects automatically.",
  },
];

export default function YamlToJsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [minify, setMinify] = useState(false);

  const convert = () => {
    if (!input.trim()) return;
    try {
      const parsed = yamlToJson(input);
      const json = minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2);
      setOutput(json);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse YAML");
      setOutput("");
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="YAML to JSON Converter"
      description="Convert YAML to JSON instantly. Supports nested objects, arrays, and multi-line strings."
      slug="yaml-to-json"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert YAML to JSON",
              content:
                "Paste your YAML content into the input panel on the left and click Convert. The tool parses the YAML structure — including nested objects, arrays (with - prefix), strings, numbers, and booleans — and outputs valid JSON on the right. You can choose between pretty-printed JSON (with 2-space indentation) or minified JSON (single line). Use the Download button to save the result as a .json file.",
            },
            {
              title: "YAML vs JSON: Key Differences",
              content:
                "YAML is a superset of JSON and is designed for human readability. YAML uses indentation to define structure, supports comments with #, and does not require quotes around strings. JSON uses curly braces and square brackets, requires double-quoted strings, and has no comment syntax. YAML is popular for configuration files (Kubernetes, Docker Compose, GitHub Actions) while JSON is preferred for API responses and data storage. Both formats represent the same data structures: objects (mappings), arrays (sequences), strings, numbers, and booleans.",
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
              setInput(SAMPLE_YAML);
              setOutput("");
              setError("");
            }}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Load Sample
          </button>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={minify}
              onChange={(e) => setMinify(e.target.checked)}
              className="rounded"
            />
            Minify output
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">YAML Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"name: example\nversion: 1\ntags:\n  - dev\n  - tool"}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-mono"
              rows={14}
              style={{ resize: "vertical" }}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium">JSON Output</label>
              <div className="flex items-center gap-2">
                {output && (
                  <>
                    <CopyButton text={output} />
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
                    >
                      Download .json
                    </button>
                  </>
                )}
              </div>
            </div>
            {error ? (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            ) : (
              <pre className="min-h-[14rem] w-full overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono whitespace-pre-wrap break-all">
                {output || <span className="text-[var(--muted-foreground)]">JSON output will appear here...</span>}
              </pre>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
