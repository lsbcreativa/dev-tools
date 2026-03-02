"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- Types ---------- */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}

/* ---------- Component ---------- */

export default function ApiTesterPage() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json", enabled: true },
  ]);
  const [body, setBody] = useState("");
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addHeader = () =>
    setHeaders((h) => [...h, { key: "", value: "", enabled: true }]);

  const updateHeader = (i: number, field: keyof Header, val: string | boolean) =>
    setHeaders((h) => h.map((hdr, idx) => (idx === i ? { ...hdr, [field]: val } : hdr)));

  const removeHeader = (i: number) =>
    setHeaders((h) => h.filter((_, idx) => idx !== i));

  const send = useCallback(async () => {
    if (!url.trim()) {
      setError("Enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    const start = performance.now();

    try {
      const reqHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.enabled && h.key.trim()) reqHeaders[h.key.trim()] = h.value;
      });

      const opts: RequestInit = { method, headers: reqHeaders };
      if (method !== "GET" && body.trim()) opts.body = body;

      const res = await fetch(url.trim(), opts);
      const elapsed = Math.round(performance.now() - start);

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });

      let resBody: string;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("json")) {
        const json = await res.json();
        resBody = JSON.stringify(json, null, 2);
      } else {
        resBody = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders,
        body: resBody,
        time: elapsed,
      });
    } catch (e) {
      setError(
        (e as Error).message ||
          "Request failed. Make sure the URL is correct and the server allows CORS."
      );
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body]);

  const statusColor = (s: number) => {
    if (s < 300) return "text-green-500";
    if (s < 400) return "text-yellow-500";
    return "text-red-500";
  };

  const PRESETS = [
    { label: "JSONPlaceholder", url: "https://jsonplaceholder.typicode.com/posts/1", method: "GET" as HttpMethod },
    { label: "POST Example", url: "https://jsonplaceholder.typicode.com/posts", method: "POST" as HttpMethod, body: '{\n  "title": "Hello",\n  "body": "World",\n  "userId": 1\n}' },
    { label: "Users API", url: "https://jsonplaceholder.typicode.com/users", method: "GET" as HttpMethod },
  ];

  return (
    <ToolLayout
      title="API Request Builder"
      description="Build and test HTTP requests with custom headers and body. View responses instantly."
      slug="api-tester"
    >
      {/* CORS notice */}
      <div className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]">
        Only works with APIs that allow CORS (Cross-Origin Resource Sharing). Most public APIs support it.
      </div>

      {/* Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setUrl(p.url);
              setMethod(p.method);
              if (p.body) setBody(p.body);
              setError("");
              setResponse(null);
            }}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Method + URL + Send */}
      <div className="flex gap-2 mb-4">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-medium"
        >
          {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-mono"
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 btn-press"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Tabs: Headers / Body */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] mb-3">
        {(["headers", "body"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px capitalize ${
              activeTab === tab
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab} {tab === "headers" && `(${headers.length})`}
          </button>
        ))}
      </div>

      {/* Headers editor */}
      {activeTab === "headers" && (
        <div className="space-y-2 mb-4">
          {headers.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={h.enabled}
                onChange={(e) => updateHeader(i, "enabled", e.target.checked)}
                className="shrink-0"
              />
              <input
                type="text"
                value={h.key}
                onChange={(e) => updateHeader(i, "key", e.target.value)}
                placeholder="Header name"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm font-mono"
              />
              <input
                type="text"
                value={h.value}
                onChange={(e) => updateHeader(i, "value", e.target.value)}
                placeholder="Value"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm font-mono"
              />
              <button
                onClick={() => removeHeader(i)}
                className="shrink-0 rounded-md px-2 py-1 text-xs text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addHeader}
            className="rounded-md border border-dashed border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          >
            + Add header
          </button>
        </div>
      )}

      {/* Body editor */}
      {activeTab === "body" && (
        <div className="mb-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{\n  "key": "value"\n}'
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
            rows={6}
            spellCheck={false}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="mt-4 space-y-3">
          {/* Status bar */}
          <div className="flex items-center gap-4 text-sm">
            <span className={`font-bold ${statusColor(response.status)}`}>
              {response.status} {response.statusText}
            </span>
            <span className="text-[var(--muted-foreground)]">
              {response.time} ms
            </span>
            <span className="text-[var(--muted-foreground)]">
              {new Blob([response.body]).size} bytes
            </span>
          </div>

          {/* Response headers */}
          <details className="rounded-lg border border-[var(--border)]">
            <summary className="cursor-pointer px-3 py-2 text-sm font-medium hover:bg-[var(--muted)]">
              Response Headers ({Object.keys(response.headers).length})
            </summary>
            <div className="border-t border-[var(--border)] p-3">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {Object.entries(response.headers)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("\n")}
              </pre>
            </div>
          </details>

          {/* Response body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Response Body</span>
              <CopyButton text={response.body} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[500px] whitespace-pre-wrap">
              {response.body}
            </pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
