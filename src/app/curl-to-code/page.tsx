"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- Types ---------- */

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  auth: { user: string; pass: string } | null;
  cookies: string;
  formData: { key: string; value: string }[];
}

/* ---------- Parser ---------- */

function tokenize(raw: string): string[] {
  // Normalize backslash‑newline continuations
  const input = raw.replace(/\\\s*\n/g, " ").trim();
  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    // skip whitespace
    while (i < input.length && /\s/.test(input[i])) i++;
    if (i >= input.length) break;

    const ch = input[i];

    if (ch === "'" || ch === '"') {
      // quoted string
      const quote = ch;
      i++;
      let token = "";
      while (i < input.length && input[i] !== quote) {
        if (input[i] === "\\" && quote === '"') {
          i++;
          token += input[i] ?? "";
        } else {
          token += input[i];
        }
        i++;
      }
      i++; // skip closing quote
      tokens.push(token);
    } else {
      let token = "";
      while (i < input.length && !/\s/.test(input[i])) {
        token += input[i];
        i++;
      }
      tokens.push(token);
    }
  }
  return tokens;
}

function parseCurl(raw: string): ParsedCurl {
  const tokens = tokenize(raw);
  const result: ParsedCurl = {
    url: "",
    method: "",
    headers: {},
    body: "",
    auth: null,
    cookies: "",
    formData: [],
  };

  let i = 0;
  // skip "curl" if first token
  if (tokens[0]?.toLowerCase() === "curl") i = 1;

  while (i < tokens.length) {
    const t = tokens[i];

    if (t === "-X" || t === "--request") {
      result.method = (tokens[++i] || "").toUpperCase();
    } else if (t === "-H" || t === "--header") {
      const header = tokens[++i] || "";
      const idx = header.indexOf(":");
      if (idx !== -1) {
        const key = header.slice(0, idx).trim();
        const val = header.slice(idx + 1).trim();
        result.headers[key] = val;
      }
    } else if (
      t === "-d" ||
      t === "--data" ||
      t === "--data-raw" ||
      t === "--data-binary"
    ) {
      result.body = tokens[++i] || "";
    } else if (t === "-u" || t === "--user") {
      const cred = tokens[++i] || "";
      const idx = cred.indexOf(":");
      if (idx !== -1) {
        result.auth = {
          user: cred.slice(0, idx),
          pass: cred.slice(idx + 1),
        };
      } else {
        result.auth = { user: cred, pass: "" };
      }
    } else if (t === "--cookie") {
      result.cookies = tokens[++i] || "";
    } else if (t === "-F" || t === "--form") {
      const pair = tokens[++i] || "";
      const eqIdx = pair.indexOf("=");
      if (eqIdx !== -1) {
        result.formData.push({
          key: pair.slice(0, eqIdx),
          value: pair.slice(eqIdx + 1),
        });
      }
    } else if (!t.startsWith("-")) {
      // positional URL
      if (!result.url) result.url = t;
    }
    i++;
  }

  if (!result.method) {
    if (result.body || result.formData.length > 0) {
      result.method = "POST";
    } else {
      result.method = "GET";
    }
  }

  return result;
}

/* ---------- Code generators ---------- */

function toJsFetch(p: ParsedCurl): string {
  const opts: string[] = [];
  opts.push(`  method: "${p.method}",`);

  const hdrs = { ...p.headers };
  if (p.auth) {
    hdrs["Authorization"] =
      "Basic " + "${btoa('" + p.auth.user + ":" + p.auth.pass + "')}";
  }
  if (p.cookies) {
    hdrs["Cookie"] = p.cookies;
  }

  if (Object.keys(hdrs).length > 0) {
    opts.push("  headers: {");
    for (const [k, v] of Object.entries(hdrs)) {
      if (k === "Authorization" && p.auth) {
        opts.push(
          `    "Authorization": \`Basic \${btoa("${p.auth.user}:${p.auth.pass}")}\`,`
        );
      } else {
        opts.push(`    "${k}": "${v}",`);
      }
    }
    opts.push("  },");
  }

  if (p.body) {
    const escaped = p.body.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
    opts.push(`  body: \`${escaped}\`,`);
  }

  if (p.formData.length > 0) {
    const formLines = [
      "  body: (() => {",
      "    const fd = new FormData();",
    ];
    for (const f of p.formData) {
      formLines.push(`    fd.append("${f.key}", "${f.value}");`);
    }
    formLines.push("    return fd;");
    formLines.push("  })(),");
    opts.push(formLines.join("\n"));
  }

  return `const response = await fetch("${p.url}", {\n${opts.join("\n")}\n});\n\nconst data = await response.json();\nconsole.log(data);`;
}

function toJsAxios(p: ParsedCurl): string {
  const lines: string[] = [];
  lines.push('import axios from "axios";');
  lines.push("");

  const configParts: string[] = [];
  configParts.push(`  method: "${p.method.toLowerCase()}",`);
  configParts.push(`  url: "${p.url}",`);

  const hdrs = { ...p.headers };
  if (p.cookies) hdrs["Cookie"] = p.cookies;

  if (Object.keys(hdrs).length > 0) {
    configParts.push("  headers: {");
    for (const [k, v] of Object.entries(hdrs)) {
      configParts.push(`    "${k}": "${v}",`);
    }
    configParts.push("  },");
  }

  if (p.auth) {
    configParts.push("  auth: {");
    configParts.push(`    username: "${p.auth.user}",`);
    configParts.push(`    password: "${p.auth.pass}",`);
    configParts.push("  },");
  }

  if (p.body) {
    // try JSON
    try {
      JSON.parse(p.body);
      configParts.push(`  data: ${p.body},`);
    } catch {
      configParts.push(`  data: ${JSON.stringify(p.body)},`);
    }
  }

  lines.push(`const { data } = await axios({\n${configParts.join("\n")}\n});`);
  lines.push("");
  lines.push("console.log(data);");
  return lines.join("\n");
}

function toPython(p: ParsedCurl): string {
  const lines: string[] = [];
  lines.push("import requests");
  lines.push("");

  const args: string[] = [];
  args.push(`    "${p.url}",`);

  if (Object.keys(p.headers).length > 0) {
    args.push("    headers={");
    for (const [k, v] of Object.entries(p.headers)) {
      args.push(`        "${k}": "${v}",`);
    }
    args.push("    },");
  }

  if (p.auth) {
    args.push(`    auth=("${p.auth.user}", "${p.auth.pass}"),`);
  }

  if (p.cookies) {
    args.push(`    cookies={"raw": "${p.cookies}"},`);
  }

  if (p.body) {
    try {
      JSON.parse(p.body);
      args.push(`    json=${p.body},`);
    } catch {
      args.push(`    data=${JSON.stringify(p.body)},`);
    }
  }

  if (p.formData.length > 0) {
    args.push("    files={");
    for (const f of p.formData) {
      args.push(`        "${f.key}": "${f.value}",`);
    }
    args.push("    },");
  }

  const method = p.method.toLowerCase();
  const fn = ["get", "post", "put", "patch", "delete", "head", "options"].includes(method)
    ? method
    : "request";

  if (fn === "request") {
    lines.push(`response = requests.request(\n    "${p.method}",`);
    lines.push(args.join("\n"));
  } else {
    lines.push(`response = requests.${fn}(`);
    lines.push(args.join("\n"));
  }
  lines.push(")");
  lines.push("");
  lines.push("print(response.json())");
  return lines.join("\n");
}

function toGo(p: ParsedCurl): string {
  const lines: string[] = [];
  lines.push("package main");
  lines.push("");
  lines.push("import (");
  lines.push('    "fmt"');
  lines.push('    "io"');
  lines.push('    "net/http"');
  if (p.body || p.formData.length > 0) lines.push('    "strings"');
  lines.push(")");
  lines.push("");
  lines.push("func main() {");

  if (p.body) {
    const escaped = p.body.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    lines.push(`    body := strings.NewReader("${escaped}")`);
    lines.push(
      `    req, err := http.NewRequest("${p.method}", "${p.url}", body)`
    );
  } else if (p.formData.length > 0) {
    const parts = p.formData
      .map((f) => `${f.key}=${f.value}`)
      .join("&");
    lines.push(`    body := strings.NewReader("${parts}")`);
    lines.push(
      `    req, err := http.NewRequest("${p.method}", "${p.url}", body)`
    );
  } else {
    lines.push(
      `    req, err := http.NewRequest("${p.method}", "${p.url}", nil)`
    );
  }

  lines.push("    if err != nil {");
  lines.push("        panic(err)");
  lines.push("    }");

  for (const [k, v] of Object.entries(p.headers)) {
    lines.push(`    req.Header.Set("${k}", "${v}")`);
  }

  if (p.auth) {
    lines.push(`    req.SetBasicAuth("${p.auth.user}", "${p.auth.pass}")`);
  }

  if (p.cookies) {
    lines.push(`    req.Header.Set("Cookie", "${p.cookies}")`);
  }

  lines.push("");
  lines.push("    client := &http.Client{}");
  lines.push("    resp, err := client.Do(req)");
  lines.push("    if err != nil {");
  lines.push("        panic(err)");
  lines.push("    }");
  lines.push("    defer resp.Body.Close()");
  lines.push("");
  lines.push("    respBody, _ := io.ReadAll(resp.Body)");
  lines.push('    fmt.Println(string(respBody))');
  lines.push("}");
  return lines.join("\n");
}

function toPhpCurl(p: ParsedCurl): string {
  const lines: string[] = [];
  lines.push("<?php");
  lines.push("");
  lines.push("$ch = curl_init();");
  lines.push("");
  lines.push(`curl_setopt($ch, CURLOPT_URL, "${p.url}");`);
  lines.push("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);");

  if (p.method !== "GET") {
    lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${p.method}");`);
  }

  if (Object.keys(p.headers).length > 0) {
    lines.push("curl_setopt($ch, CURLOPT_HTTPHEADER, [");
    for (const [k, v] of Object.entries(p.headers)) {
      lines.push(`    "${k}: ${v}",`);
    }
    lines.push("]);");
  }

  if (p.body) {
    const escaped = p.body.replace(/'/g, "\\'");
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${escaped}');`);
  }

  if (p.auth) {
    lines.push(
      `curl_setopt($ch, CURLOPT_USERPWD, "${p.auth.user}:${p.auth.pass}");`
    );
  }

  if (p.cookies) {
    lines.push(`curl_setopt($ch, CURLOPT_COOKIE, "${p.cookies}");`);
  }

  if (p.formData.length > 0) {
    lines.push("curl_setopt($ch, CURLOPT_POSTFIELDS, [");
    for (const f of p.formData) {
      lines.push(`    "${f.key}" => "${f.value}",`);
    }
    lines.push("]);");
  }

  lines.push("");
  lines.push("$response = curl_exec($ch);");
  lines.push("curl_close($ch);");
  lines.push("");
  lines.push("echo $response;");
  return lines.join("\n");
}

/* ---------- Presets ---------- */

const PRESETS: { label: string; value: string }[] = [
  {
    label: "GET JSON API",
    value: `curl https://api.example.com/users \\\n  -H "Accept: application/json"`,
  },
  {
    label: "POST with JSON body",
    value: `curl -X POST https://api.example.com/users \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Jane", "email": "jane@example.com"}'`,
  },
  {
    label: "Auth with Bearer token",
    value: `curl https://api.example.com/me \\\n  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiam9obiJ9.abc123" \\\n  -H "Accept: application/json"`,
  },
];

/* ---------- Tabs ---------- */

const TABS = [
  { id: "js-fetch", label: "JS (fetch)", gen: toJsFetch },
  { id: "js-axios", label: "JS (axios)", gen: toJsAxios },
  { id: "python", label: "Python", gen: toPython },
  { id: "go", label: "Go", gen: toGo },
  { id: "php", label: "PHP (curl)", gen: toPhpCurl },
] as const;

/* ---------- Component ---------- */

export default function CurlToCodePage() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<string>("js-fetch");
  const [error, setError] = useState("");

  const parsed = useMemo<ParsedCurl | null>(() => {
    if (!input.trim()) return null;
    try {
      const p = parseCurl(input);
      if (!p.url) throw new Error("No URL found in curl command");
      setError("");
      return p;
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [input]);

  const code = useMemo(() => {
    if (!parsed) return "";
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return "";
    try {
      return tab.gen(parsed);
    } catch (e) {
      return `// Error generating code: ${(e as Error).message}`;
    }
  }, [parsed, activeTab]);

  return (
    <ToolLayout
      title="Curl to Code"
      description="Convert curl commands to JavaScript, Python, Go, and PHP code snippets."
      slug="curl-to-code"
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

      {/* Input */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Paste curl command
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'curl https://api.example.com/users \\\n  -H "Accept: application/json"'}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={6}
          spellCheck={false}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Output */}
      {parsed && !error && (
        <div className="mt-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[var(--border)] mb-3 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
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
              {TABS.find((t) => t.id === activeTab)?.label} output
            </span>
            <CopyButton text={code} />
          </div>

          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[500px] whitespace-pre-wrap">
            {code}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
