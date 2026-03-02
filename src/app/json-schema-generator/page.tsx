"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ------------------------------------------------------------------ */
/*  Regex heuristics for format detection                              */
/* ------------------------------------------------------------------ */
const FORMAT_PATTERNS: [RegExp, string][] = [
  [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "email"],
  [/^https?:\/\/[^\s]+$/, "uri"],
  [/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, "date-time"],
  [/^\d{4}-\d{2}-\d{2}$/, "date"],
  [/^(\d{1,3}\.){3}\d{1,3}$/, "ipv4"],
];

function detectFormat(value: string): string | undefined {
  for (const [re, fmt] of FORMAT_PATTERNS) {
    if (re.test(value)) return fmt;
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Recursive schema generator                                         */
/* ------------------------------------------------------------------ */
interface SchemaNode {
  type?: string;
  format?: string;
  properties?: Record<string, SchemaNode>;
  required?: string[];
  items?: SchemaNode;
  [key: string]: unknown;
}

function inferSchema(value: unknown, inferRequired: boolean): SchemaNode {
  if (value === null) {
    return { type: "null" };
  }

  if (Array.isArray(value)) {
    const schema: SchemaNode = { type: "array" };
    if (value.length > 0) {
      // Merge all item schemas into one
      schema.items = mergeSchemas(
        value.map((item) => inferSchema(item, inferRequired))
      );
    } else {
      schema.items = {};
    }
    return schema;
  }

  if (typeof value === "object") {
    const schema: SchemaNode = { type: "object" };
    const properties: Record<string, SchemaNode> = {};
    const keys = Object.keys(value as Record<string, unknown>);

    for (const key of keys) {
      properties[key] = inferSchema(
        (value as Record<string, unknown>)[key],
        inferRequired
      );
    }

    schema.properties = properties;

    if (inferRequired && keys.length > 0) {
      schema.required = keys;
    }

    return schema;
  }

  if (typeof value === "string") {
    const schema: SchemaNode = { type: "string" };
    const fmt = detectFormat(value);
    if (fmt) schema.format = fmt;
    return schema;
  }

  if (typeof value === "number") {
    return { type: Number.isInteger(value) ? "integer" : "number" };
  }

  if (typeof value === "boolean") {
    return { type: "boolean" };
  }

  return {};
}

/* ------------------------------------------------------------------ */
/*  Merge multiple schemas (for array items)                           */
/* ------------------------------------------------------------------ */
function mergeSchemas(schemas: SchemaNode[]): SchemaNode {
  if (schemas.length === 0) return {};
  if (schemas.length === 1) return schemas[0];

  const types = new Set(schemas.map((s) => s.type).filter(Boolean));

  // If all items have the same type, merge deeply
  if (types.size === 1) {
    const type = schemas[0].type;

    if (type === "object") {
      const allKeys = new Set<string>();
      for (const s of schemas) {
        if (s.properties) {
          for (const k of Object.keys(s.properties)) allKeys.add(k);
        }
      }

      const mergedProps: Record<string, SchemaNode> = {};
      const requiredSets = schemas.map(
        (s) => new Set(s.required || [])
      );

      for (const key of allKeys) {
        const propSchemas = schemas
          .filter((s) => s.properties && s.properties[key])
          .map((s) => s.properties![key]);
        mergedProps[key] =
          propSchemas.length > 0 ? mergeSchemas(propSchemas) : {};
      }

      // A key is required only if it appears in ALL schemas' required arrays
      const commonRequired = [...allKeys].filter((key) =>
        requiredSets.every((set) => set.has(key))
      );

      const merged: SchemaNode = {
        type: "object",
        properties: mergedProps,
      };
      if (commonRequired.length > 0) merged.required = commonRequired;
      return merged;
    }

    if (type === "array") {
      const itemSchemas = schemas
        .filter((s) => s.items)
        .map((s) => s.items!);
      return {
        type: "array",
        items: itemSchemas.length > 0 ? mergeSchemas(itemSchemas) : {},
      };
    }

    // Primitives with same type - just return one
    const merged: SchemaNode = { type };
    const formats = schemas.map((s) => s.format).filter(Boolean);
    if (formats.length > 0 && new Set(formats).size === 1) {
      merged.format = formats[0];
    }
    return merged;
  }

  // Mixed types - use anyOf
  const uniqueSchemas: SchemaNode[] = [];
  const seen = new Set<string>();
  for (const s of schemas) {
    const key = JSON.stringify(s);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSchemas.push(s);
    }
  }

  if (uniqueSchemas.length === 1) return uniqueSchemas[0];
  return { anyOf: uniqueSchemas };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function JsonSchemaGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [inferRequired, setInferRequired] = useState(true);

  const generate = () => {
    if (!input.trim()) {
      setError("Please enter some JSON data.");
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const schema: SchemaNode = {
        $schema: "http://json-schema.org/draft-07/schema#",
        ...inferSchema(parsed, inferRequired),
      };
      setOutput(JSON.stringify(schema, null, 2));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const sampleJson = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "website": "https://example.com",
  "active": true,
  "score": 9.5,
  "tags": ["dev", "admin"],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "ip": "192.168.1.1"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}`;

  const loadSample = () => {
    setInput(sampleJson);
    setError("");
    setOutput("");
  };

  return (
    <ToolLayout
      title="JSON Schema Generator"
      description="Paste JSON data and auto-generate a JSON Schema Draft 7 with type detection, format heuristics, and nested structures."
      slug="json-schema-generator"
    >
      {/* Input */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium">Input JSON</label>
          <button
            onClick={loadSample}
            className="text-xs text-[var(--primary)] hover:underline"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "example", "value": 42}'
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={10}
        />
      </div>

      {/* Controls */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={generate}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Generate Schema
        </button>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inferRequired}
            onChange={(e) => setInferRequired(e.target.checked)}
            className="rounded"
          />
          Infer required fields
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Generated JSON Schema (Draft 7)</span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[32rem]">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
