"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- Types ---------- */

interface EnvVar {
  key: string;
  value: string;
}

type OutputFormat = "env" | "json" | "yaml" | "docker-compose";

/* ---------- Parsers ---------- */

function parseEnv(raw: string): EnvVar[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      if (idx === -1) return { key: l, value: "" };
      let val = l.slice(idx + 1);
      // strip surrounding quotes
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      return { key: l.slice(0, idx), value: val };
    });
}

function parseJson(raw: string): EnvVar[] {
  const obj = JSON.parse(raw);
  return Object.entries(obj).map(([key, value]) => ({
    key,
    value: String(value),
  }));
}

function parseYaml(raw: string): EnvVar[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf(":");
      if (idx === -1) return null;
      let val = l.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      return { key: l.slice(0, idx).trim(), value: val };
    })
    .filter(Boolean) as EnvVar[];
}

/* ---------- Formatters ---------- */

function toEnv(vars: EnvVar[]): string {
  return vars
    .filter((v) => v.key)
    .map((v) => {
      const needsQuotes = v.value.includes(" ") || v.value.includes('"');
      return `${v.key}=${needsQuotes ? `"${v.value}"` : v.value}`;
    })
    .join("\n");
}

function toJson(vars: EnvVar[]): string {
  const obj: Record<string, string> = {};
  vars.filter((v) => v.key).forEach((v) => (obj[v.key] = v.value));
  return JSON.stringify(obj, null, 2);
}

function toYaml(vars: EnvVar[]): string {
  return vars
    .filter((v) => v.key)
    .map((v) => {
      const needsQuotes =
        v.value.includes(":") ||
        v.value.includes("#") ||
        v.value.includes(" ") ||
        v.value === "true" ||
        v.value === "false" ||
        /^\d+$/.test(v.value);
      return `${v.key}: ${needsQuotes ? `"${v.value}"` : v.value}`;
    })
    .join("\n");
}

function toDockerCompose(vars: EnvVar[]): string {
  const lines = ["services:", "  app:", "    environment:"];
  vars
    .filter((v) => v.key)
    .forEach((v) => {
      lines.push(`      - ${v.key}=${v.value}`);
    });
  return lines.join("\n");
}

const formatters: Record<OutputFormat, (vars: EnvVar[]) => string> = {
  env: toEnv,
  json: toJson,
  yaml: toYaml,
  "docker-compose": toDockerCompose,
};

/* ---------- Presets ---------- */

const PRESETS = [
  {
    label: "Node.js app",
    value: `NODE_ENV=production\nPORT=3000\nDATABASE_URL=postgres://user:pass@localhost:5432/mydb\nREDIS_URL=redis://localhost:6379\nJWT_SECRET=supersecretkey123\nLOG_LEVEL=info`,
  },
  {
    label: "AWS config",
    value: `AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nAWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nAWS_DEFAULT_REGION=us-east-1\nS3_BUCKET=my-app-bucket`,
  },
  {
    label: "JSON format",
    value: `{\n  "API_URL": "https://api.example.com",\n  "API_KEY": "sk-1234567890",\n  "DEBUG": "false"\n}`,
  },
];

/* ---------- Component ---------- */

export default function EnvEditorPage() {
  const [input, setInput] = useState("");
  const [vars, setVars] = useState<EnvVar[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("env");
  const [parseError, setParseError] = useState("");

  const parseInput = (raw: string) => {
    setInput(raw);
    setParseError("");
    if (!raw.trim()) {
      setVars([]);
      return;
    }

    try {
      // Try JSON first
      if (raw.trim().startsWith("{")) {
        setVars(parseJson(raw));
        return;
      }
      // Try YAML-like (has colons but no equals)
      if (raw.includes(":") && !raw.includes("=")) {
        setVars(parseYaml(raw));
        return;
      }
      // Default: .env format
      setVars(parseEnv(raw));
    } catch (e) {
      setParseError((e as Error).message);
    }
  };

  const updateVar = (i: number, field: "key" | "value", val: string) =>
    setVars((v) => v.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  const removeVar = (i: number) => setVars((v) => v.filter((_, idx) => idx !== i));

  const addVar = () => setVars((v) => [...v, { key: "", value: "" }]);

  const output = useMemo(() => {
    if (vars.length === 0) return "";
    return formatters[outputFormat](vars);
  }, [vars, outputFormat]);

  const TABS: { id: OutputFormat; label: string }[] = [
    { id: "env", label: ".env" },
    { id: "json", label: "JSON" },
    { id: "yaml", label: "YAML" },
    { id: "docker-compose", label: "Docker Compose" },
  ];

  return (
    <ToolLayout
      title="Env Variables Editor"
      description="Edit environment variables visually. Convert between .env, JSON, YAML, and docker-compose formats."
      slug="env-editor"
    >
      {/* Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => parseInput(p.value)}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">
          Paste .env, JSON, or YAML
        </label>
        <textarea
          value={input}
          onChange={(e) => parseInput(e.target.value)}
          placeholder={'DB_HOST=localhost\nDB_PORT=5432\nDB_NAME=myapp'}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={6}
          spellCheck={false}
        />
      </div>

      {/* Parse error */}
      {parseError && (
        <div className="mb-4 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {parseError}
        </div>
      )}

      {/* Visual editor */}
      {vars.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">
              Variables ({vars.length})
            </h3>
            <button
              onClick={addVar}
              className="rounded-md border border-dashed border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            >
              + Add variable
            </button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {vars.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={v.key}
                  onChange={(e) => updateVar(i, "key", e.target.value)}
                  placeholder="KEY"
                  className="w-1/3 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm font-mono font-bold"
                />
                <span className="text-[var(--muted-foreground)]">=</span>
                <input
                  type="text"
                  value={v.value}
                  onChange={(e) => updateVar(i, "value", e.target.value)}
                  placeholder="value"
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm font-mono"
                />
                <button
                  onClick={() => removeVar(i)}
                  className="shrink-0 rounded-md px-2 py-1 text-xs text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      {vars.length > 0 && (
        <div>
          {/* Format tabs */}
          <div className="flex items-center gap-1 border-b border-[var(--border)] mb-3 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOutputFormat(tab.id)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  outputFormat === tab.id
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              Output
            </span>
            <CopyButton text={output} />
          </div>

          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[400px] whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
