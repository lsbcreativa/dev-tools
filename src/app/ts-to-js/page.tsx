"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_TS = `import type { Config } from "./config";
import { type User, getUsers } from "./api";

export type Status = "active" | "inactive" | "pending";

export interface Product {
  id: number;
  name: string;
  price: number;
  tags: string[];
  metadata?: Record<string, unknown>;
}

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

type CartTotal = {
  subtotal: number;
  tax: number;
  total: number;
};

declare const API_URL: string;

enum Direction {
  Up,
  Down,
  Left,
  Right
}

abstract class BaseService {
  protected readonly apiUrl: string;
  private token: string;
  public name: string;

  constructor(url: string, token: string) {
    this.apiUrl = url;
    this.token = token;
    this.name = "service";
  }

  abstract fetchData(): Promise<void>;
}

class CartService extends BaseService {
  private items: CartItem[] = [];

  constructor(url: string, token: string) {
    super(url, token);
  }

  async fetchData(): Promise<void> {
    const response = await fetch(this.apiUrl);
    const data: Product[] = await response.json();
    console.log(data);
  }

  addItem(product: Product, quantity: number): void {
    const existing = this.items.find(
      (item: CartItem) => item.product.id === product.id
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity, addedAt: new Date() });
    }
  }

  getTotal(): CartTotal {
    const subtotal = this.items.reduce(
      (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    return { subtotal, tax, total: subtotal + tax };
  }
}

function formatPrice<T extends number>(value: T): string {
  return \`$\${(value as number).toFixed(2)}\`;
}

const processItems = <T extends Product>(items: readonly T[]): T[] => {
  return items.filter((item: T) => item.price > 0);
};

const config = {
  debug: false as boolean,
  maxRetries: 3 as const,
};

const user: User = getUsers()!.find((u: User) => u.id === 1)!;
const userName: string = user!.name;

export { CartService, formatPrice, processItems };`;

function convertTsToJs(ts: string): string {
  let result = ts;

  // 1. Remove `import type { ... } from '...'` lines
  result = result.replace(/^import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*$/gm, "");

  // 2. Remove `import type X from '...'` lines
  result = result.replace(/^import\s+type\s+\w+\s+from\s+['"][^'"]*['"];?\s*$/gm, "");

  // 3. Remove `{ type X, ... }` -> `{ ... }` in imports (inline type imports)
  result = result.replace(
    /import\s*\{([^}]*)\}/g,
    (match: string, inner: string) => {
      const cleaned = inner
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => !s.startsWith("type "))
        .join(", ");
      if (!cleaned) return match; // will be cleaned as empty import
      return `import { ${cleaned} }`;
    }
  );

  // Remove imports that ended up empty: import {  } from '...'
  result = result.replace(/^import\s*\{\s*\}\s*from\s+['"][^'"]*['"];?\s*$/gm, "");

  // 4. Remove `export type X = ...;` lines
  result = result.replace(/^export\s+type\s+\w+[\s\S]*?;\s*$/gm, "");

  // 5. Remove `export interface X { ... }` blocks (with nested braces)
  result = result.replace(/^export\s+interface\s+\w+[^{]*\{[^]*?\n\}\s*$/gm, (match: string) => {
    return removeBraceBlock(match, /^export\s+interface\s+/);
  });

  // 6. Remove standalone `interface X { ... }` blocks
  result = result.replace(/^interface\s+\w+[^{]*\{[^]*?\n\}\s*$/gm, (match: string) => {
    return removeBraceBlock(match, /^interface\s+/);
  });

  // 7. Remove standalone `type X = { ... };` blocks
  result = result.replace(/^type\s+\w+\s*=\s*\{[^]*?\n\};\s*$/gm, "");

  // 8. Remove standalone `type X = ...;` lines (simple type aliases)
  result = result.replace(/^type\s+\w+\s*=[^{]*?;\s*$/gm, "");

  // 9. Remove `declare` keyword lines
  result = result.replace(/^declare\s+.*$/gm, "");

  // 10. Convert basic numeric enums: enum Foo { A, B, C } -> const Foo = { A: 0, B: 1, C: 2 };
  result = result.replace(
    /^(\s*)(?:export\s+)?enum\s+(\w+)\s*\{([^}]*)\}/gm,
    (_match: string, indent: string, name: string, body: string) => {
      const members = body
        .split(",")
        .map((m: string) => m.trim())
        .filter((m: string) => m.length > 0);
      const entries = members
        .map((m: string, i: number) => {
          const parts = m.split("=").map((p: string) => p.trim());
          const key = parts[0];
          const val = parts.length > 1 ? parts[1] : String(i);
          return `${key}: ${val}`;
        })
        .join(", ");
      return `${indent}const ${name} = { ${entries} };`;
    }
  );

  // 11. Remove `abstract` keyword
  result = result.replace(/\babstract\s+/g, "");

  // 12. Remove `readonly` keyword
  result = result.replace(/\breadonly\s+/g, "");

  // 13. Remove `public`, `private`, `protected` access modifiers
  result = result.replace(/\b(public|private|protected)\s+/g, "");

  // 14. Remove generic type parameters from function declarations and arrow functions
  // e.g., function foo<T extends X>(...)  ->  function foo(...)
  result = result.replace(
    /(\bfunction\s+\w+)\s*<[^>()]*(?:<[^>]*>[^>()]*)*>/g,
    "$1"
  );

  // Arrow function generics: const fn = <T extends X>(...) -> const fn = (...)
  result = result.replace(
    /=\s*<[^>()]*(?:<[^>]*>[^>()]*)*>\s*\(/g,
    "= ("
  );

  // 15. Remove return type annotations: ): Type { or ): Type => or ): Type;
  result = result.replace(
    /\):\s*[A-Za-z_$][\w$]*(?:<[^>]*>)?(?:\[\])?\s*(?=\{|=>|;|\n)/g,
    ")"
  );

  // 16. Remove type annotations after parameters: (x: Type, y: Type)
  // Handle function parameters with type annotations
  result = result.replace(
    /(\(|,)\s*(\w+)\s*:\s*(?:readonly\s+)?[A-Za-z_$][\w$.|&]*(?:<[^>]*>)?(?:\[\])*/g,
    "$1 $2"
  );

  // Handle optional parameters: (x?: Type) -> (x)
  result = result.replace(
    /(\(|,)\s*(\w+)\?\s*:\s*[A-Za-z_$][\w$.|&]*(?:<[^>]*>)?(?:\[\])*/g,
    "$1 $2"
  );

  // 17. Remove type annotations in variable declarations: const x: Type = -> const x =
  result = result.replace(
    /(\b(?:const|let|var)\s+\w+)\s*:\s*(?:readonly\s+)?[A-Za-z_$][\w$.|&]*(?:<[^>]*(?:<[^>]*>[^>]*)*>)?(?:\[\])*\s*(?==)/g,
    "$1 "
  );

  // 18. Remove `as Type` assertions
  result = result.replace(
    /\s+as\s+(?:readonly\s+)?[A-Za-z_$][\w$]*(?:<[^>]*>)?/g,
    ""
  );

  // 19. Remove non-null assertions: x!.prop -> x.prop, x! -> x
  result = result.replace(/(\w)!\./g, "$1.");
  result = result.replace(/(\w)!([^=])/g, "$1$2");
  result = result.replace(/(\w)!$/gm, "$1");

  // 20. Clean up: collapse multiple blank lines into max 2
  result = result.replace(/\n{3,}/g, "\n\n");

  // Trim leading/trailing whitespace
  result = result.trim();

  return result;
}

function removeBraceBlock(match: string, startPattern: RegExp): string {
  if (!startPattern.test(match)) return match;
  let depth = 0;
  let started = false;
  for (const ch of match) {
    if (ch === "{") {
      depth++;
      started = true;
    }
    if (ch === "}") {
      depth--;
      if (started && depth === 0) return "";
    }
  }
  return "";
}

export default function TsToJsTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(convertTsToJs(value));
    } catch {
      setOutput("// Error converting TypeScript");
    }
  }, []);

  const handleLoadSample = () => {
    handleConvert(SAMPLE_TS);
  };

  const faqs = [
    {
      question: "Does this remove all TypeScript-specific code?",
      answer: "Yes. Type annotations, interfaces, type aliases, enums, generic parameters, access modifiers, and declare statements are removed. Runtime code (functions, variables, classes, logic) is preserved.",
    },
    {
      question: "What happens to TypeScript enums?",
      answer: "TypeScript enums are transpiled to JavaScript objects or removed depending on the implementation. Const enums are inlined at compile time. This tool removes enum declarations — for complex transpilation, use the TypeScript compiler (tsc).",
    },
    {
      question: "Why would I need to convert TypeScript to JavaScript?",
      answer: "Common use cases include sharing code with JavaScript-only projects, debugging compiled output, converting TypeScript examples for JavaScript users, and migrating away from TypeScript. The TypeScript compiler (tsc) handles full transpilation; this tool provides quick type stripping.",
    },
  ];

  return (
    <ToolLayout
      title="TypeScript to JavaScript"
      description="Convert TypeScript code to plain JavaScript by removing type annotations, interfaces, and TS-specific syntax."
      slug="ts-to-js"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert TypeScript to JavaScript",
              content: "Paste your TypeScript code and get clean JavaScript output with all type annotations, interfaces, type aliases, enums, and TypeScript-specific syntax removed. The tool preserves your code logic, variable names, and formatting while stripping away everything that isn't valid JavaScript.",
            },
            {
              title: "What Gets Removed in TypeScript to JavaScript Conversion",
              content: "TypeScript adds type safety on top of JavaScript, but the types are erased at compile time. This tool removes: type annotations (: string, : number), interface and type declarations, generic parameters (<T>), 'as' type assertions, readonly modifiers, access modifiers (public, private, protected), abstract classes, and declare statements. The remaining code is valid JavaScript that runs in any browser or Node.js environment.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={handleLoadSample}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Load Sample
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">TypeScript Input</label>
            <textarea
              value={input}
              onChange={(e) => handleConvert(e.target.value)}
              placeholder="Paste your TypeScript code here..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm font-mono"
              rows={20}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium">JavaScript Output</label>
              {output && <CopyButton text={output} />}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="JavaScript output will appear here..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
              rows={20}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
