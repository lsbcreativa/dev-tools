"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_JSON = JSON.stringify(
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    isActive: true,
    age: 32,
    address: {
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zip: "62701",
      coordinates: { lat: 39.7817, lng: -89.6501 },
    },
    tags: ["admin", "editor"],
    orders: [
      {
        orderId: "ORD-001",
        total: 59.99,
        items: [
          { sku: "ITEM-A", quantity: 2, price: 19.99 },
          { sku: "ITEM-B", quantity: 1, price: 20.01 },
        ],
        shippedAt: null,
      },
      {
        orderId: "ORD-002",
        total: 120.0,
        items: [{ sku: "ITEM-C", quantity: 3, price: 40.0 }],
        shippedAt: "2024-03-15T10:30:00Z",
      },
    ],
    metadata: null,
  },
  null,
  2
);

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase())
    .replace(/^[a-z]/, (ch) => ch.toUpperCase());
}

interface GeneratorOptions {
  useTypeAlias: boolean;
  addExport: boolean;
  rootName: string;
}

function generateTypeScript(
  jsonStr: string,
  options: GeneratorOptions
): string {
  const parsed = JSON.parse(jsonStr);
  const interfaces: Map<string, string> = new Map();

  function inferType(value: unknown, name: string): string {
    if (value === null || value === undefined) {
      return "unknown";
    }
    if (Array.isArray(value)) {
      return inferArrayType(value, name);
    }
    switch (typeof value) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      default:
        if (typeof value === "object") {
          buildInterface(value as Record<string, unknown>, name);
          return name;
        }
        return "unknown";
    }
  }

  function inferArrayType(arr: unknown[], parentName: string): string {
    if (arr.length === 0) {
      return "unknown[]";
    }

    const singularName = parentName.endsWith("s")
      ? parentName.slice(0, -1)
      : parentName + "Item";

    const itemTypes = new Set<string>();
    const objectSamples: Record<string, unknown>[] = [];

    for (const item of arr) {
      if (item === null || item === undefined) {
        itemTypes.add("null");
      } else if (Array.isArray(item)) {
        itemTypes.add(inferArrayType(item, singularName));
      } else if (typeof item === "object") {
        objectSamples.push(item as Record<string, unknown>);
      } else {
        itemTypes.add(typeof item);
      }
    }

    if (objectSamples.length > 0) {
      const merged = mergeObjectShapes(objectSamples);
      buildInterface(merged.shape, toPascalCase(singularName), merged.optionalKeys);
      itemTypes.add(toPascalCase(singularName));
    }

    if (itemTypes.size === 0) return "unknown[]";
    if (itemTypes.size === 1) {
      const t = Array.from(itemTypes)[0];
      return t + "[]";
    }
    return "(" + Array.from(itemTypes).join(" | ") + ")[]";
  }

  function mergeObjectShapes(objects: Record<string, unknown>[]): {
    shape: Record<string, unknown>;
    optionalKeys: Set<string>;
  } {
    const allKeys = new Set<string>();
    const keyCounts: Record<string, number> = {};
    const merged: Record<string, unknown> = {};

    for (const obj of objects) {
      for (const key of Object.keys(obj)) {
        allKeys.add(key);
        keyCounts[key] = (keyCounts[key] || 0) + 1;
        if (merged[key] === undefined || merged[key] === null) {
          merged[key] = obj[key];
        }
      }
    }

    const optionalKeys = new Set<string>();
    for (const key of allKeys) {
      if (keyCounts[key] < objects.length) {
        optionalKeys.add(key);
      }
    }

    return { shape: merged, optionalKeys };
  }

  function buildInterface(
    obj: Record<string, unknown>,
    name: string,
    forceOptional?: Set<string>
  ): void {
    const pascalName = toPascalCase(name);
    const lines: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const childName = toPascalCase(pascalName + toPascalCase(key));
      const isNullable = value === null || value === undefined;
      const isForceOptional = forceOptional?.has(key) ?? false;
      const optional = isNullable || isForceOptional;

      let tsType: string;
      if (isNullable && !isForceOptional) {
        tsType = "unknown";
      } else if (isNullable && isForceOptional) {
        tsType = "unknown";
      } else {
        tsType = inferType(value, childName);
      }

      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `"${key}"`;
      lines.push(`  ${safeKey}${optional ? "?" : ""}: ${tsType};`);
    }

    const prefix = options.addExport ? "export " : "";

    if (options.useTypeAlias) {
      interfaces.set(
        pascalName,
        `${prefix}type ${pascalName} = {\n${lines.join("\n")}\n};`
      );
    } else {
      interfaces.set(
        pascalName,
        `${prefix}interface ${pascalName} {\n${lines.join("\n")}\n}`
      );
    }
  }

  const rootName = toPascalCase(options.rootName || "Root");

  if (Array.isArray(parsed)) {
    const itemType = inferArrayType(parsed, rootName);
    const prefix = options.addExport ? "export " : "";
    interfaces.set(
      "__root__",
      `${prefix}type ${rootName} = ${itemType};`
    );
  } else if (typeof parsed === "object" && parsed !== null) {
    buildInterface(parsed as Record<string, unknown>, rootName);
  } else {
    const prefix = options.addExport ? "export " : "";
    interfaces.set(
      "__root__",
      `${prefix}type ${rootName} = ${typeof parsed};`
    );
  }

  const result: string[] = [];
  const entries = Array.from(interfaces.entries());

  // Put child interfaces first, root last
  for (const [key, value] of entries) {
    if (key !== toPascalCase(rootName) && key !== "__root__") {
      result.push(value);
    }
  }
  // Root interface last
  const rootEntry =
    interfaces.get(toPascalCase(rootName)) || interfaces.get("__root__");
  if (rootEntry) {
    result.push(rootEntry);
  }

  return result.join("\n\n");
}

export default function JsonToTypescriptPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [useTypeAlias, setUseTypeAlias] = useState(false);
  const [addExport, setAddExport] = useState(true);
  const [rootName, setRootName] = useState("Root");

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const result = generateTypeScript(input, {
        useTypeAlias,
        addExport,
        rootName: rootName || "Root",
      });
      setOutput(result);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, useTypeAlias, addExport, rootName]);

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setError("");
  };

  return (
    <ToolLayout
      title="JSON to TypeScript"
      description="Convert JSON objects into TypeScript interfaces or type aliases with full support for nested structures."
      slug="json-to-typescript"
      faqs={[
        { question: "How does JSON to TypeScript conversion work?", answer: "The tool analyzes the structure and values of your JSON data to infer TypeScript types. Strings become string, numbers become number, booleans become boolean, arrays become typed arrays, and nested objects generate nested interfaces. It also detects optional fields when analyzing arrays of objects." },
        { question: "Should I use interfaces or type aliases?", answer: "Interfaces are better for object shapes that might be extended (declaration merging). Type aliases are better for unions, intersections, and complex types. For API response types, interfaces are the conventional choice in most TypeScript codebases." },
        { question: "Does this handle nested JSON objects?", answer: "Yes. The tool recursively generates separate interfaces for each nested object, using the parent key name as the interface name. Arrays of objects also get their own interface definitions." }
      ]}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Convert JSON to TypeScript Interfaces", content: "Paste your JSON data in the input field to automatically generate TypeScript interfaces. The tool infers types from values — strings, numbers, booleans, null, arrays, and nested objects all get proper TypeScript types. You can customize the root interface name, choose between interface and type alias syntax, and toggle export statements." },
            { title: "Why Generate TypeScript Types from JSON?", content: "Manually writing TypeScript interfaces for API responses is tedious and error-prone. This tool automates the process, ensuring your types exactly match the data structure. Use it when integrating new APIs, migrating JavaScript code to TypeScript, or creating type definitions for configuration files." }
          ]}
          faqs={[
            { question: "How does JSON to TypeScript conversion work?", answer: "The tool analyzes the structure and values of your JSON data to infer TypeScript types. Strings become string, numbers become number, booleans become boolean, arrays become typed arrays, and nested objects generate nested interfaces. It also detects optional fields when analyzing arrays of objects." },
            { question: "Should I use interfaces or type aliases?", answer: "Interfaces are better for object shapes that might be extended (declaration merging). Type aliases are better for unions, intersections, and complex types. For API response types, interfaces are the conventional choice in most TypeScript codebases." },
            { question: "Does this handle nested JSON objects?", answer: "Yes. The tool recursively generates separate interfaces for each nested object, using the parent key name as the interface name. Arrays of objects also get their own interface definitions." }
          ]}
        />
      }
    >
      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-[var(--muted-foreground)]">Style:</span>
          <button
            onClick={() => setUseTypeAlias(false)}
            className={`rounded-md px-3 py-1 text-sm font-medium border transition-colors btn-press ${
              !useTypeAlias
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
            }`}
          >
            interface
          </button>
          <button
            onClick={() => setUseTypeAlias(true)}
            className={`rounded-md px-3 py-1 text-sm font-medium border transition-colors btn-press ${
              useTypeAlias
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
            }`}
          >
            type
          </button>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={addExport}
            onChange={(e) => setAddExport(e.target.checked)}
            className="rounded"
          />
          <span>Add export</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-[var(--muted-foreground)]">Root name:</span>
          <input
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="w-28 rounded-md border border-[var(--border)] px-2 py-1 text-sm font-mono"
            placeholder="Root"
          />
        </label>
      </div>

      {/* Input */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium">Paste JSON</label>
          <button
            onClick={loadSample}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30}'
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={10}
          spellCheck={false}
        />
      </div>

      {/* Convert button */}
      <button
        onClick={convert}
        className="mt-3 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 btn-press"
      >
        Convert to TypeScript
      </button>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Output */}
      {output && !error && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">TypeScript Output</span>
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
