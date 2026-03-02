"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

// --- JSON to YAML serializer ---
function jsonToYaml(value: unknown, indent: number = 0): string {
  const prefix = "  ".repeat(indent);

  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    // Quote strings that contain special YAML characters or could be misinterpreted
    if (
      value === "" ||
      value === "true" ||
      value === "false" ||
      value === "null" ||
      value === "yes" ||
      value === "no" ||
      /^[\d.]+$/.test(value) ||
      /[:#{}[\],&*?|>!%@`'"]/.test(value) ||
      value.includes("\n") ||
      value.startsWith(" ") ||
      value.endsWith(" ")
    ) {
      return JSON.stringify(value);
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const lines: string[] = [];
    for (const item of value) {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const entries = Object.entries(item);
        if (entries.length > 0) {
          const [firstKey, firstVal] = entries[0];
          lines.push(`${prefix}- ${firstKey}: ${jsonToYaml(firstVal, indent + 2)}`);
          for (let i = 1; i < entries.length; i++) {
            const [k, v] = entries[i];
            lines.push(`${prefix}  ${k}: ${jsonToYaml(v, indent + 2)}`);
          }
        } else {
          lines.push(`${prefix}- {}`);
        }
      } else {
        lines.push(`${prefix}- ${jsonToYaml(item, indent + 1)}`);
      }
    }
    return lines.join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines: string[] = [];
    for (const [key, val] of entries) {
      const safeKey = /[:#{}[\],&*?|>!%@`'" ]/.test(key) || key === "" ? JSON.stringify(key) : key;
      if (typeof val === "object" && val !== null) {
        if (Array.isArray(val) && val.length === 0) {
          lines.push(`${prefix}${safeKey}: []`);
        } else if (!Array.isArray(val) && Object.keys(val).length === 0) {
          lines.push(`${prefix}${safeKey}: {}`);
        } else {
          lines.push(`${prefix}${safeKey}:`);
          lines.push(jsonToYaml(val, indent + 1));
        }
      } else {
        lines.push(`${prefix}${safeKey}: ${jsonToYaml(val, indent + 1)}`);
      }
    }
    return lines.join("\n");
  }

  return String(value);
}

// --- YAML to JSON parser ---
interface YamlLine {
  indent: number;
  raw: string;
  content: string;
}

function parseYamlLines(yaml: string): YamlLine[] {
  return yaml
    .split("\n")
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"))
    .map((raw) => {
      const match = raw.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      return { indent, raw, content: raw.trim() };
    });
}

function parseYamlValue(str: string): unknown {
  const trimmed = str.trim();
  if (trimmed === "" || trimmed === "null" || trimmed === "~") return null;
  if (trimmed === "true" || trimmed === "yes") return true;
  if (trimmed === "false" || trimmed === "no") return false;
  if (trimmed === "[]") return [];
  if (trimmed === "{}") return {};

  // Quoted strings
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }

  // Numbers
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);

  return trimmed;
}

function yamlToJson(yaml: string): unknown {
  const lines = parseYamlLines(yaml);
  if (lines.length === 0) return null;

  function parseBlock(start: number, baseIndent: number): { value: unknown; nextIndex: number } {
    if (start >= lines.length) return { value: null, nextIndex: start };

    const line = lines[start];

    // Array item
    if (line.content.startsWith("- ")) {
      const arr: unknown[] = [];
      let i = start;
      while (i < lines.length && lines[i].indent === baseIndent && lines[i].content.startsWith("- ")) {
        const itemContent = lines[i].content.slice(2).trim();

        // Check if this array item is a key: value pair
        const kvMatch = itemContent.match(/^([^:]+?):\s*(.*)/);
        if (kvMatch) {
          const obj: Record<string, unknown> = {};
          const key = kvMatch[1].trim();
          const valStr = kvMatch[2].trim();

          if (valStr === "" || valStr === "|" || valStr === ">") {
            // Nested block under this key
            const childIndent = baseIndent + 2;
            if (i + 1 < lines.length && lines[i + 1].indent >= childIndent) {
              const result = parseBlock(i + 1, childIndent);
              obj[key] = result.value;
              i = result.nextIndex;
            } else {
              obj[key] = valStr === "" ? null : "";
              i++;
            }
          } else {
            obj[key] = parseYamlValue(valStr);
            i++;
          }

          // Collect subsequent key: value pairs at deeper indent for same object
          const itemBodyIndent = baseIndent + 2;
          while (i < lines.length && lines[i].indent === itemBodyIndent && !lines[i].content.startsWith("- ")) {
            const subKv = lines[i].content.match(/^([^:]+?):\s*(.*)/);
            if (subKv) {
              const subKey = subKv[1].trim();
              const subVal = subKv[2].trim();
              if (subVal === "" || subVal === "|" || subVal === ">") {
                const childIndent2 = itemBodyIndent + 2;
                if (i + 1 < lines.length && lines[i + 1].indent >= childIndent2) {
                  const result = parseBlock(i + 1, childIndent2);
                  obj[subKey] = result.value;
                  i = result.nextIndex;
                } else {
                  obj[subKey] = subVal === "" ? null : "";
                  i++;
                }
              } else {
                obj[subKey] = parseYamlValue(subVal);
                i++;
              }
            } else {
              break;
            }
          }

          arr.push(obj);
        } else {
          // Simple array item
          if (itemContent === "") {
            // Nested block
            const childIndent = baseIndent + 2;
            if (i + 1 < lines.length && lines[i + 1].indent >= childIndent) {
              const result = parseBlock(i + 1, childIndent);
              arr.push(result.value);
              i = result.nextIndex;
            } else {
              arr.push(null);
              i++;
            }
          } else {
            arr.push(parseYamlValue(itemContent));
            i++;
          }
        }
      }
      return { value: arr, nextIndex: i };
    }

    // Key: value mapping
    const kvMatch = line.content.match(/^([^:]+?):\s*(.*)/);
    if (kvMatch) {
      const obj: Record<string, unknown> = {};
      let i = start;
      while (i < lines.length && lines[i].indent === baseIndent) {
        const kvm = lines[i].content.match(/^([^:]+?):\s*(.*)/);
        if (!kvm) break;

        const key = kvm[1].trim();
        const valStr = kvm[2].trim();

        if (valStr === "" || valStr === "|" || valStr === ">") {
          // Nested block
          const childIndent = baseIndent + 2;
          if (i + 1 < lines.length && lines[i + 1].indent >= childIndent) {
            const nextLineIndent = lines[i + 1].indent;
            const result = parseBlock(i + 1, nextLineIndent);
            obj[key] = result.value;
            i = result.nextIndex;
          } else {
            obj[key] = valStr === "" ? null : "";
            i++;
          }
        } else {
          obj[key] = parseYamlValue(valStr);
          i++;
        }
      }
      return { value: obj, nextIndex: i };
    }

    // Plain scalar
    return { value: parseYamlValue(line.content), nextIndex: start + 1 };
  }

  const result = parseBlock(0, lines[0].indent);
  return result.value;
}

export default function JsonYamlTool() {
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
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
      if (mode === "json-to-yaml") {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      } else {
        const parsed = yamlToJson(input);
        setOutput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Conversion failed. Check your input format."
      );
    }
  };

  const faqs = [
    {
      question: "Does YAML preserve JSON data types?",
      answer:
        "Yes. Both formats support strings, numbers, booleans, null, objects (mappings), and arrays (sequences). The conversion is lossless for these standard types. YAML additionally supports date types and multiline strings which have no direct JSON equivalent.",
    },
    {
      question: "Why do some YAML values need quotes?",
      answer:
        "YAML values that could be misinterpreted need quoting — for example, 'true', 'false', 'null', 'yes', 'no', and strings that look like numbers. Strings containing special characters like colons, brackets, or hash signs also require quoting to avoid parsing errors.",
    },
    {
      question: "Can I convert YAML with comments to JSON?",
      answer:
        "Yes, but comments are stripped during conversion since JSON does not support comments. If you convert back from JSON to YAML, the comments will not be restored. Consider keeping your original YAML file as the source of truth.",
    },
    {
      question: "What YAML features are supported?",
      answer:
        "This tool supports key-value mappings, sequences (arrays), nested structures, quoted strings, boolean values (true/false/yes/no), null values, integers, and floating-point numbers. Advanced YAML features like anchors, aliases, and custom tags are not supported.",
    },
  ];

  return (
    <ToolLayout
      title="JSON to YAML Converter"
      description="Convert between JSON and YAML formats instantly."
      slug="json-yaml"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert Between JSON and YAML",
              content:
                "Select your conversion direction (JSON to YAML or YAML to JSON), paste your data, and click Convert. This tool handles nested objects, arrays, quoted strings, boolean values, null, and numeric types. The JSON to YAML conversion preserves structure with proper indentation, while YAML to JSON parsing supports key-value mappings, sequences, inline collections, and comments (which are stripped during conversion).",
            },
            {
              title: "JSON vs YAML: When to Use Each Format",
              content:
                "JSON is the standard for APIs, configuration files in JavaScript ecosystems (package.json, tsconfig.json), and data interchange between services. YAML is preferred for human-readable configuration files like Docker Compose, Kubernetes manifests, GitHub Actions workflows, and Ansible playbooks. YAML supports comments, multiline strings, and anchors/aliases, while JSON is more strict and universally parseable. Both formats represent the same data structures — objects and arrays — making conversion between them straightforward.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode("json-to-yaml"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "json-to-yaml"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          JSON &rarr; YAML
        </button>
        <button
          onClick={() => { setMode("yaml-to-json"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            mode === "yaml-to-json"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          YAML &rarr; JSON
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {mode === "json-to-yaml" ? "JSON Input" : "YAML Input"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "json-to-yaml"
              ? '{\n  "name": "John",\n  "age": 30,\n  "hobbies": ["reading", "coding"]\n}'
              : "name: John\nage: 30\nhobbies:\n  - reading\n  - coding"
          }
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={8}
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
              {mode === "json-to-yaml" ? "YAML Output" : "JSON Output"}
            </span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
