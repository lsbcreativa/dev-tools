"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ---------- Generator ---------- */

interface ComponentConfig {
  name: string;
  typescript: boolean;
  propsInterface: boolean;
  useState: boolean;
  useEffect: boolean;
  forwardRef: boolean;
  memo: boolean;
  children: boolean;
  className: boolean;
  defaultExport: boolean;
}

function generateComponent(cfg: ComponentConfig): string {
  const lines: string[] = [];
  const name = cfg.name || "MyComponent";

  // Imports
  const reactImports: string[] = [];
  if (cfg.forwardRef) reactImports.push("forwardRef");
  if (cfg.memo) reactImports.push("memo");
  if (cfg.useState) reactImports.push("useState");
  if (cfg.useEffect) reactImports.push("useEffect");

  if (reactImports.length > 0) {
    lines.push(`import React, { ${reactImports.join(", ")} } from "react";`);
  } else {
    lines.push(`import React from "react";`);
  }
  lines.push("");

  // Props interface
  if (cfg.propsInterface && cfg.typescript) {
    lines.push(`interface ${name}Props {`);
    if (cfg.children) lines.push("  children: React.ReactNode;");
    if (cfg.className) lines.push("  className?: string;");
    lines.push("}");
    lines.push("");
  }

  // Component
  const propsParam = () => {
    if (!cfg.propsInterface) {
      if (cfg.children && cfg.className) return cfg.typescript ? "{ children, className }: { children: React.ReactNode; className?: string }" : "{ children, className }";
      if (cfg.children) return cfg.typescript ? "{ children }: { children: React.ReactNode }" : "{ children }";
      if (cfg.className) return cfg.typescript ? "{ className }: { className?: string }" : "{ className }";
      return "";
    }
    const destructured: string[] = [];
    if (cfg.children) destructured.push("children");
    if (cfg.className) destructured.push("className");
    const type = cfg.typescript ? `: ${name}Props` : "";
    return destructured.length > 0 ? `{ ${destructured.join(", ")} }${type}` : `props${type}`;
  };

  if (cfg.forwardRef) {
    if (cfg.typescript) {
      lines.push(`const ${name} = forwardRef<HTMLDivElement, ${cfg.propsInterface ? `${name}Props` : "Record<string, unknown>"}>((`);
      lines.push(`  ${propsParam()},`);
      lines.push(`  ref`);
      lines.push(`) => {`);
    } else {
      lines.push(`const ${name} = forwardRef((${propsParam()}, ref) => {`);
    }
  } else {
    lines.push(`function ${name}(${propsParam()}) {`);
  }

  // Hook: useState
  if (cfg.useState) {
    lines.push(cfg.typescript
      ? `  const [value, setValue] = useState<string>("");`
      : `  const [value, setValue] = useState("");`
    );
    lines.push("");
  }

  // Hook: useEffect
  if (cfg.useEffect) {
    lines.push("  useEffect(() => {");
    lines.push("    // Side effect here");
    lines.push("");
    lines.push("    return () => {");
    lines.push("      // Cleanup");
    lines.push("    };");
    lines.push("  }, []);");
    lines.push("");
  }

  // Return JSX
  lines.push("  return (");
  const refAttr = cfg.forwardRef ? " ref={ref}" : "";
  const classAttr = cfg.className ? ` className={className}` : "";
  lines.push(`    <div${refAttr}${classAttr}>`);
  if (cfg.children) {
    lines.push("      {children}");
  } else {
    lines.push(`      <h1>${name}</h1>`);
  }
  lines.push("    </div>");
  lines.push("  );");

  if (cfg.forwardRef) {
    lines.push("});");
    lines.push("");
    lines.push(`${name}.displayName = "${name}";`);
  } else {
    lines.push("}");
  }

  lines.push("");

  // Export
  if (cfg.memo) {
    if (cfg.defaultExport) {
      lines.push(`export default memo(${name});`);
    } else {
      lines.push(`export const Memoized${name} = memo(${name});`);
    }
  } else {
    if (cfg.defaultExport) {
      if (!cfg.forwardRef) {
        lines.push(`export default ${name};`);
      } else {
        lines.push(`export default ${name};`);
      }
    } else {
      lines.push(`export { ${name} };`);
    }
  }

  return lines.join("\n");
}

/* ---------- Component ---------- */

export default function ReactGeneratorPage() {
  const [name, setName] = useState("MyComponent");
  const [typescript, setTypescript] = useState(true);
  const [propsInterface, setPropsInterface] = useState(true);
  const [useStateHook, setUseStateHook] = useState(false);
  const [useEffectHook, setUseEffectHook] = useState(false);
  const [forwardRef, setForwardRef] = useState(false);
  const [memo, setMemo] = useState(false);
  const [children, setChildren] = useState(true);
  const [className, setClassName] = useState(true);
  const [defaultExport, setDefaultExport] = useState(true);

  const output = useMemo(
    () =>
      generateComponent({
        name: name || "MyComponent",
        typescript,
        propsInterface,
        useState: useStateHook,
        useEffect: useEffectHook,
        forwardRef,
        memo,
        children,
        className,
        defaultExport,
      }),
    [name, typescript, propsInterface, useStateHook, useEffectHook, forwardRef, memo, children, className, defaultExport]
  );

  const options = [
    { label: "TypeScript", checked: typescript, set: setTypescript },
    { label: "Props interface", checked: propsInterface, set: setPropsInterface },
    { label: "useState", checked: useStateHook, set: setUseStateHook },
    { label: "useEffect", checked: useEffectHook, set: setUseEffectHook },
    { label: "forwardRef", checked: forwardRef, set: setForwardRef },
    { label: "React.memo", checked: memo, set: setMemo },
    { label: "children prop", checked: children, set: setChildren },
    { label: "className prop", checked: className, set: setClassName },
    { label: "default export", checked: defaultExport, set: setDefaultExport },
  ];

  const faqs = [
    {
      question: "Should I use TypeScript for React components?",
      answer: "Yes. TypeScript catches prop type errors at compile time, provides autocompletion in IDEs, and serves as documentation for your component's API. Most modern React projects use TypeScript.",
    },
    {
      question: "When should I use React.memo?",
      answer: "Use React.memo for components that render the same output given the same props and are re-rendered frequently due to parent updates. Don't overuse it — memoization has its own memory cost and is unnecessary for components that already render quickly.",
    },
    {
      question: "What is forwardRef used for?",
      answer: "forwardRef allows parent components to access the underlying DOM element of your component via a ref. It's needed for focus management, animations, measurements, and integration with third-party libraries that require DOM access.",
    },
  ];

  return (
    <ToolLayout
      title="React Component Generator"
      description="Generate React functional components with TypeScript, hooks, forwardRef, memo and custom props."
      slug="react-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Generate React Components",
              content: "Enter your component name and select the options you need: TypeScript support, props interface, useState, useEffect, forwardRef, React.memo, children prop, className prop, and export style. The tool generates a complete React functional component following modern best practices that you can copy directly into your project.",
            },
            {
              title: "React Component Patterns and Best Practices",
              content: "Modern React favors functional components with hooks over class components. Use TypeScript for type safety, forwardRef when parent components need DOM access, React.memo for preventing unnecessary re-renders of pure components, and custom hooks for reusable logic. Consistent component structure — imports, types, component definition, export — improves codebase maintainability across teams.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Component name */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Component Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
          placeholder="MyComponent"
          className="w-64 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-mono"
        />
      </div>

      {/* Options */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Options</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {options.map((opt) => (
            <label
              key={opt.label}
              className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors text-sm ${
                opt.checked
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] hover:bg-[var(--muted)]"
              }`}
            >
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={(e) => opt.set(e.target.checked)}
                className="shrink-0"
              />
              <span className="font-mono text-xs">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {name || "MyComponent"}.{typescript ? "tsx" : "jsx"}
          </span>
          <CopyButton text={output} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[500px] whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </ToolLayout>
  );
}
