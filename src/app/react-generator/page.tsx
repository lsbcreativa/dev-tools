"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

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

  return (
    <ToolLayout
      title="React Component Generator"
      description="Generate React functional components with TypeScript, hooks, forwardRef, memo and custom props."
      slug="react-generator"
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
