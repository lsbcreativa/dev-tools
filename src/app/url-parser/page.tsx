"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_URL =
  "https://api.example.com:8443/v2/users/search?q=john+doe&page=2&limit=25&active=true#results";

interface ParsedUrl {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  queryParams: Array<{ key: string; value: string }>;
}

function parseUrl(input: string): ParsedUrl | null {
  try {
    const url = new URL(input.trim());
    const queryParams: Array<{ key: string; value: string }> = [];
    url.searchParams.forEach((value, key) => {
      queryParams.push({ key, value });
    });
    return {
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      queryParams,
    };
  } catch {
    return null;
  }
}

interface ComponentCardProps {
  label: string;
  value: string;
  mono?: boolean;
  empty?: boolean;
}

function ComponentCard({ label, value, mono = true, empty = false }: ComponentCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
      <div className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">{label}</div>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`break-all text-sm ${mono ? "font-mono" : ""} ${
            empty ? "italic text-[var(--muted-foreground)]" : ""
          }`}
        >
          {value || "(empty)"}
        </span>
        {!empty && value && <CopyButton text={value} label="" />}
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "What are the components of a URL?",
    answer:
      "A URL (Uniform Resource Locator) consists of: protocol (e.g. https:), which defines the communication method; hostname (e.g. example.com), which identifies the server; port (e.g. 443), which specifies the network port (often implicit); path (e.g. /path/to/page), which identifies the resource; query string (e.g. ?key=value), which passes parameters; and hash/fragment (e.g. #section), which points to a section within the page.",
  },
  {
    question: "What are query parameters?",
    answer:
      "Query parameters are key-value pairs appended to a URL after a ? character. Multiple parameters are separated by & characters. For example, in the URL /search?q=hello&page=2, the parameters are q=hello and page=2. They are commonly used to pass filter options, search terms, pagination, and other options to web servers and APIs. Values can be URL-encoded (spaces become %20 or +).",
  },
  {
    question: "What is URL encoding?",
    answer:
      "URL encoding (also called percent-encoding) replaces special characters in URLs with a percent sign followed by two hexadecimal digits. Spaces become %20 or + in query strings, & becomes %26, = becomes %3D, and so on. This ensures URLs only contain valid ASCII characters. The encodeURIComponent() JavaScript function encodes values for query parameters, while encodeURI() encodes an entire URL.",
  },
  {
    question: "What is the difference between a URL and a URI?",
    answer:
      "A URI (Uniform Resource Identifier) is a broader concept that identifies a resource. A URL (Uniform Resource Locator) is a type of URI that also specifies how to locate the resource (including the protocol and address). A URN (Uniform Resource Name) is another type of URI that names a resource without specifying its location. In practice, URL and URI are often used interchangeably in web development.",
  },
];

export default function UrlParserTool() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setParsed(null);
      setIsValid(null);
      return;
    }
    const result = parseUrl(input);
    setParsed(result);
    setIsValid(result !== null);
  }, [input]);

  return (
    <ToolLayout
      title="URL Parser"
      description="Break down any URL into its components: protocol, host, path, query parameters, and hash."
      slug="url-parser"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Parse a URL",
              content:
                "Enter any URL into the input field above. The parser automatically breaks it down into its components as you type. Each component is displayed in its own card: protocol (the scheme like https: or ftp:), host (hostname and port together), hostname (the domain name), port (explicit or default), path (the resource path), query string (the raw ?key=value parameters), query parameters (parsed into individual key-value pairs), and hash (the page fragment after #). Each component has a copy button for easy extraction.",
            },
            {
              title: "URL Structure: Components Explained",
              content:
                "A full URL follows this structure: scheme://username:password@host:port/path?query#fragment. In practice, most URLs look like https://example.com/path?param=value#section. The scheme (protocol) tells the browser how to communicate: https uses TLS encryption, http is unencrypted, ftp is for file transfer. The host combines hostname and port; if the port matches the protocol's default (80 for http, 443 for https), it is omitted. The path identifies the resource on the server. The query string passes optional parameters as key=value pairs. The fragment is processed client-side and never sent to the server.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">URL Input</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://example.com/path?query=value#section"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono"
            />
            <button
              onClick={() => {
                setInput(SAMPLE_URL);
              }}
              className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              Sample
            </button>
          </div>
        </div>

        {isValid !== null && (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                isValid
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {isValid ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Valid URL
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Invalid URL
                </>
              )}
            </span>
          </div>
        )}

        {parsed && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <ComponentCard label="Protocol" value={parsed.protocol} />
              <ComponentCard label="Host (hostname + port)" value={parsed.host} />
              <ComponentCard label="Hostname" value={parsed.hostname} />
              <ComponentCard
                label="Port"
                value={parsed.port || "(default for protocol)"}
                empty={!parsed.port}
              />
            </div>

            <ComponentCard label="Path" value={parsed.pathname} />

            {parsed.hash && (
              <ComponentCard label="Hash / Fragment" value={parsed.hash} />
            )}

            {parsed.queryParams.length > 0 && (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
                <div className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">
                  Query Parameters ({parsed.queryParams.length})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="pb-2 pr-4 text-left text-xs font-medium text-[var(--muted-foreground)]">
                          Key
                        </th>
                        <th className="pb-2 pr-4 text-left text-xs font-medium text-[var(--muted-foreground)]">
                          Value
                        </th>
                        <th className="pb-2 text-right text-xs font-medium text-[var(--muted-foreground)]">
                          Copy
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.queryParams.map((param, i) => (
                        <tr key={i} className="border-b border-[var(--border)] last:border-0">
                          <td className="py-2 pr-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                            {param.key}
                          </td>
                          <td className="py-2 pr-4 font-mono break-all">
                            {param.value || <span className="italic text-[var(--muted-foreground)]">(empty)</span>}
                          </td>
                          <td className="py-2 text-right">
                            <CopyButton text={param.value} label="" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {parsed.queryParams.length === 0 && input && (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-3 text-sm text-[var(--muted-foreground)]">
                No query parameters found in this URL.
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
