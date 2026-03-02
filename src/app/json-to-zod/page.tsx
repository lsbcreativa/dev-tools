"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ---------- Zod schema generator ---------- */

function jsonToZod(value: unknown, indent = 0, rootName = "schema"): string {
  const pad = "  ".repeat(indent);

  if (value === null) return "z.null()";
  if (value === undefined) return "z.undefined()";

  switch (typeof value) {
    case "string": {
      // Detect common formats
      if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value)) return "z.string().datetime()";
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "z.string().email()";
      if (/^https?:\/\//.test(value)) return "z.string().url()";
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return "z.string().uuid()";
      return "z.string()";
    }
    case "number":
      return Number.isInteger(value) ? "z.number().int()" : "z.number()";
    case "boolean":
      return "z.boolean()";
    case "object": {
      if (Array.isArray(value)) {
        if (value.length === 0) return "z.array(z.unknown())";
        const itemSchema = jsonToZod(value[0], indent + 1, "");
        return `z.array(${itemSchema})`;
      }

      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return "z.object({})";

      const lines = entries.map(([key, val]) => {
        const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${pad}  ${safeName}: ${jsonToZod(val, indent + 1, "")}`;
      });

      return `z.object({\n${lines.join(",\n")},\n${pad}})`;
    }
    default:
      return "z.unknown()";
  }
}

function generateZodCode(
  json: unknown,
  name: string,
  addExport: boolean,
  addInfer: boolean
): string {
  const lines: string[] = [];
  lines.push('import { z } from "zod";');
  lines.push("");

  const schema = jsonToZod(json, 0, name);
  const decl = addExport ? "export const" : "const";
  lines.push(`${decl} ${name} = ${schema};`);

  if (addInfer) {
    lines.push("");
    const typeName = name.charAt(0).toUpperCase() + name.slice(1);
    const typeDecl = addExport ? "export type" : "type";
    lines.push(`${typeDecl} ${typeName} = z.infer<typeof ${name}>;`);
  }

  return lines.join("\n");
}

/* ---------- Presets ---------- */

const PRESETS = [
  {
    label: "User object",
    value: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "role": "admin",
  "createdAt": "2024-01-15T10:30:00Z"
}`,
  },
  {
    label: "API response",
    value: `{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Hello World",
      "url": "https://example.com/post/1",
      "published": true,
      "views": 1542
    }
  ],
  "total": 100,
  "page": 1
}`,
  },
  {
    label: "Config",
    value: `{
  "port": 3000,
  "host": "localhost",
  "database": {
    "url": "postgres://localhost:5432/mydb",
    "pool": 10,
    "ssl": false
  },
  "cors": {
    "origins": ["https://example.com"],
    "credentials": true
  }
}`,
  },
];

/* ---------- Component ---------- */

export default function JsonToZodPage() {
  const [input, setInput] = useState("");
  const [schemaName, setSchemaName] = useState("schema");
  const [addExport, setAddExport] = useState(true);
  const [addInfer, setAddInfer] = useState(true);
  const [error, setError] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      const parsed = JSON.parse(input);
      setError("");
      return generateZodCode(parsed, schemaName || "schema", addExport, addInfer);
    } catch (e) {
      setError((e as Error).message);
      return "";
    }
  }, [input, schemaName, addExport, addInfer]);

  const faqs = [
    {
      question: "What JSON types does this converter support?",
      answer:
        "This tool supports all JSON types: strings, numbers (integers and floats), booleans, null, arrays, and nested objects. It also detects string formats like email, URL, UUID, and datetime to apply specific Zod validators.",
    },
    {
      question: "Can I use the generated Zod schema in production?",
      answer:
        "Yes. The generated schemas use standard Zod syntax and are production-ready. Review the output for edge cases specific to your data, such as optional fields or union types that may need manual refinement.",
    },
    {
      question: "What is z.infer and why should I use it?",
      answer:
        "z.infer is a Zod utility type that extracts the TypeScript type from a Zod schema. Instead of writing both a Zod schema and a TypeScript interface, z.infer derives the type automatically, keeping your validation and types in sync.",
    },
    {
      question: "How does this compare to JSON Schema?",
      answer:
        "Zod schemas are TypeScript-native and provide both validation and type inference in one declaration. JSON Schema is language-agnostic but requires separate tooling for TypeScript types. Zod is preferred in modern TypeScript projects for its developer experience and type safety.",
    },
  ];

  return (
    <ToolLayout
      title="JSON to Zod Schema"
      description="Generate Zod validation schemas from JSON data automatically. Supports nested objects, arrays, and type inference."
      slug="json-to-zod"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert JSON to Zod Schemas",
              content:
                "Paste your JSON data into the input field and get a fully typed Zod validation schema instantly. This tool analyzes your JSON structure recursively, detecting types for strings, numbers, booleans, arrays, objects, and null values. It also recognizes common string formats like emails, URLs, UUIDs, and ISO datetime strings, applying the appropriate Zod validators automatically.",
            },
            {
              title: "Why Use Zod for Runtime Validation",
              content:
                "Zod is the leading TypeScript-first schema validation library, providing runtime type checking that complements TypeScript's compile-time types. Unlike TypeScript alone, Zod validates data at runtime — critical for API responses, form inputs, and environment variables. With z.infer, you get automatic TypeScript type generation from your schemas, eliminating the need to maintain separate type definitions. This tool generates production-ready Zod schemas that you can use directly in your Next.js, Express, or tRPC projects.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setInput(p.value);
              setError("");
            }}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">Schema name</label>
          <input
            type="text"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value.replace(/[^a-zA-Z0-9_$]/g, ""))}
            className="w-40 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm font-mono"
          />
        </div>
        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="checkbox" checked={addExport} onChange={(e) => setAddExport(e.target.checked)} />
          export
        </label>
        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="checkbox" checked={addInfer} onChange={(e) => setAddInfer(e.target.checked)} />
          z.infer type
        </label>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">JSON Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "name": "John",\n  "age": 30,\n  "email": "john@example.com"\n}'}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={8}
          spellCheck={false}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Zod Schema</span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[500px] whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
