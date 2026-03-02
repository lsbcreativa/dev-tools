"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_HEADERS = `HTTP/2 200 OK
content-type: text/html; charset=UTF-8
content-length: 4523
content-encoding: gzip
cache-control: public, max-age=3600, must-revalidate
etag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
last-modified: Mon, 25 Mar 2026 10:00:00 GMT
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
content-security-policy: default-src 'self'; script-src 'self' 'nonce-abc123'
access-control-allow-origin: https://app.example.com
access-control-allow-methods: GET, POST, OPTIONS
server: nginx/1.25.3
x-powered-by: Express
via: 1.1 varnish
transfer-encoding: chunked
connection: keep-alive`;

type HeaderCategory = "Security" | "Caching" | "CORS" | "Content" | "Auth" | "Cookie" | "Other";

interface HeaderInfo {
  explanation: string;
  category: HeaderCategory;
  isSecurity?: boolean;
}

const HEADER_DB: Record<string, HeaderInfo> = {
  "content-type": {
    explanation:
      "Indicates the media type (MIME type) of the response body, such as text/html, application/json, or image/png. May include charset (e.g. charset=UTF-8) to specify the character encoding.",
    category: "Content",
  },
  "content-length": {
    explanation:
      "The size of the response body in bytes. Allows the client to know when it has received the complete response without needing chunked transfer encoding.",
    category: "Content",
  },
  "content-encoding": {
    explanation:
      "Specifies the encoding applied to the response body, such as gzip, br (Brotli), or deflate. The client must decode the body using this algorithm before processing it.",
    category: "Content",
  },
  "cache-control": {
    explanation:
      "Controls caching behavior for both browsers and intermediary caches. Common directives: max-age=N (cache for N seconds), no-cache (revalidate before using), no-store (never cache), public (cacheable by shared caches), private (only browser cache), must-revalidate (enforce expiry strictly).",
    category: "Caching",
  },
  etag: {
    explanation:
      'A unique identifier for a specific version of a resource. The browser sends this value in subsequent If-None-Match requests; if the resource hasn\'t changed, the server responds with 304 Not Modified, saving bandwidth.',
    category: "Caching",
  },
  expires: {
    explanation:
      "An HTTP date after which the response is considered stale. Older alternative to Cache-Control: max-age. If both are present, Cache-Control takes precedence.",
    category: "Caching",
  },
  "last-modified": {
    explanation:
      "The date and time when the resource was last changed. Browsers send this in If-Modified-Since requests to check if the resource has been updated since it was last fetched.",
    category: "Caching",
  },
  "strict-transport-security": {
    explanation:
      "HSTS (HTTP Strict Transport Security) tells browsers to only communicate with this site using HTTPS for a specified duration (max-age in seconds). includeSubDomains extends this to all subdomains. preload enables browser preload lists.",
    category: "Security",
    isSecurity: true,
  },
  "x-frame-options": {
    explanation:
      "Prevents the page from being embedded in an iframe on other domains, protecting against clickjacking attacks. Values: DENY (never allow framing), SAMEORIGIN (allow framing from same origin only).",
    category: "Security",
    isSecurity: true,
  },
  "x-content-type-options": {
    explanation:
      "With value nosniff, prevents the browser from MIME-sniffing the response and forces it to use the declared content-type. Protects against certain types of XSS attacks where browsers might execute mis-typed content.",
    category: "Security",
    isSecurity: true,
  },
  "x-xss-protection": {
    explanation:
      "Enables the browser's built-in XSS filter. Value '1; mode=block' enables filtering and blocks the page if an attack is detected. Largely superseded by Content-Security-Policy but still used for older browsers.",
    category: "Security",
    isSecurity: true,
  },
  "content-security-policy": {
    explanation:
      "CSP defines trusted sources for content types (scripts, styles, images, fonts, etc.) to mitigate XSS. For example, script-src 'self' means only scripts from the same origin are allowed. One of the most powerful web security headers.",
    category: "Security",
    isSecurity: true,
  },
  "access-control-allow-origin": {
    explanation:
      "A CORS header that specifies which origins are allowed to access the resource. Value * allows all origins. A specific origin (e.g. https://app.example.com) restricts access to that domain. Required for cross-origin XHR/Fetch requests.",
    category: "CORS",
  },
  "access-control-allow-methods": {
    explanation:
      "CORS header listing the HTTP methods (GET, POST, PUT, DELETE, etc.) allowed when accessing the resource cross-origin. Sent as part of preflight (OPTIONS) responses.",
    category: "CORS",
  },
  "access-control-allow-headers": {
    explanation:
      "CORS header specifying which request headers can be used in cross-origin requests. Common values: Content-Type, Authorization. Required if you send custom headers in cross-origin requests.",
    category: "CORS",
  },
  "access-control-allow-credentials": {
    explanation:
      "CORS header indicating whether the response can be exposed when credentials (cookies, HTTP authentication, TLS certificates) are included in cross-origin requests. Must be true to allow cookies with cross-origin fetch.",
    category: "CORS",
  },
  "access-control-max-age": {
    explanation:
      "CORS header specifying how long (in seconds) the results of a preflight request can be cached. Reduces the number of OPTIONS requests the browser must send.",
    category: "CORS",
  },
  authorization: {
    explanation:
      "Contains credentials to authenticate the client with the server. Common schemes: Bearer (JWT or OAuth token), Basic (base64-encoded username:password). This is a request header but commonly inspected in header dumps.",
    category: "Auth",
  },
  "www-authenticate": {
    explanation:
      "Sent with a 401 Unauthorized response to indicate the authentication scheme(s) supported by the server (e.g. Basic, Bearer). Tells the client how to authenticate.",
    category: "Auth",
  },
  "set-cookie": {
    explanation:
      "Instructs the browser to store a cookie. Attributes include: Expires/Max-Age (duration), Domain/Path (scope), Secure (HTTPS only), HttpOnly (not accessible to JavaScript, reduces XSS risk), SameSite (CSRF protection: Strict, Lax, or None).",
    category: "Cookie",
  },
  cookie: {
    explanation:
      "Contains stored cookies sent by the browser to the server. Each cookie is a name=value pair. Multiple cookies are separated by semicolons. This is a request header sent automatically by the browser.",
    category: "Cookie",
  },
  server: {
    explanation:
      "Identifies the server software handling the request (e.g. nginx/1.25.3, Apache/2.4, cloudflare). Many security professionals recommend hiding or spoofing this header to avoid disclosing server software versions to attackers.",
    category: "Other",
  },
  via: {
    explanation:
      "Added by proxies and gateways, listing the intermediate protocols and hosts through which the request or response has passed. Useful for debugging CDN and proxy configurations.",
    category: "Other",
  },
  "x-powered-by": {
    explanation:
      "Reveals the technology stack used by the server (e.g. Express, PHP/8.1, ASP.NET). Often recommended to remove this header to avoid disclosing implementation details that could help attackers.",
    category: "Other",
  },
  "transfer-encoding": {
    explanation:
      "Specifies the encoding used to safely transfer the response body. chunked means the body is sent in a series of chunks, allowing streaming before the total size is known. Other values: compress, deflate, gzip.",
    category: "Content",
  },
  connection: {
    explanation:
      "Controls whether the TCP connection stays open after the transaction. keep-alive (default in HTTP/1.1) reuses the connection for multiple requests. close instructs the server to close the connection after the response.",
    category: "Other",
  },
  "x-request-id": {
    explanation:
      "A unique identifier for the request, often assigned by load balancers or API gateways. Used for request tracing, correlating logs across distributed systems, and debugging production issues.",
    category: "Other",
  },
  vary: {
    explanation:
      "Tells caches which request headers were used to determine the response. For example, Vary: Accept-Encoding means the server may return different encodings and caches should store separate copies per encoding.",
    category: "Caching",
  },
  "referrer-policy": {
    explanation:
      "Controls how much referrer information is included in requests. Strict-origin-when-cross-origin (recommended) sends the full URL for same-origin requests but only the origin for cross-origin. Helps protect user privacy.",
    category: "Security",
    isSecurity: true,
  },
  "permissions-policy": {
    explanation:
      "Formerly Feature-Policy. Controls which browser features and APIs can be used on the page and in iframes (e.g. camera, microphone, geolocation). Restricting permissions reduces the attack surface.",
    category: "Security",
    isSecurity: true,
  },
  "cross-origin-opener-policy": {
    explanation:
      "COOP prevents other windows from getting a reference to this window. same-origin isolates the page's browsing context group, enabling SharedArrayBuffer and required for high-resolution timers.",
    category: "Security",
    isSecurity: true,
  },
  "cross-origin-embedder-policy": {
    explanation:
      "COEP requires all resources to opt-in to being loaded cross-origin. require-corp ensures the document can only load resources that explicitly grant cross-origin access. Required together with COOP for SharedArrayBuffer.",
    category: "Security",
    isSecurity: true,
  },
};

const SECURITY_HEADERS = [
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
  "content-security-policy",
  "referrer-policy",
  "permissions-policy",
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
];

const CATEGORY_COLORS: Record<HeaderCategory, string> = {
  Security:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
  Caching:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
  CORS: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900",
  Content:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
  Auth: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900",
  Cookie:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900",
  Other:
    "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
};

interface ParsedHeader {
  name: string;
  value: string;
  info: HeaderInfo | null;
}

function parseHeaders(raw: string): ParsedHeader[] {
  const lines = raw.split(/\r?\n/);
  const headers: ParsedHeader[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("HTTP/")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const name = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();
    if (!name) continue;
    const normalizedName = name.toLowerCase();
    const info = HEADER_DB[normalizedName] ?? null;
    headers.push({ name, value, info });
  }
  return headers;
}

const faqs = [
  {
    question: "What are HTTP headers?",
    answer:
      "HTTP headers are metadata fields sent alongside HTTP requests and responses. Request headers (sent by the browser) include things like Accept, Authorization, and Cookie. Response headers (sent by the server) include Content-Type, Cache-Control, and Set-Cookie. Headers provide information about the request/response body, authentication, caching instructions, and security policies.",
  },
  {
    question: "What are the most important security headers?",
    answer:
      "The key security headers are: Strict-Transport-Security (force HTTPS), Content-Security-Policy (prevent XSS), X-Frame-Options (prevent clickjacking), X-Content-Type-Options (prevent MIME sniffing), Referrer-Policy (control referrer information), and Permissions-Policy (restrict browser feature access). Sites missing these headers are more vulnerable to common web attacks. Tools like securityheaders.com can score your site's header configuration.",
  },
  {
    question: "What is CORS and why does it matter?",
    answer:
      "CORS (Cross-Origin Resource Sharing) is a security mechanism that controls which external websites can make requests to your API or server. Browsers enforce a same-origin policy by default, blocking cross-origin requests. CORS headers like Access-Control-Allow-Origin tell browsers which origins are permitted. Misconfigured CORS (e.g. allowing all origins with *) can expose APIs to unauthorized access from any website.",
  },
  {
    question: "How do I read HTTP headers from a real server?",
    answer:
      "You can inspect HTTP response headers in several ways: Chrome/Firefox DevTools → Network tab → click a request → Headers section; curl command: curl -I https://example.com shows only response headers; the -v flag shows all headers. You can also use online tools like securityheaders.com or httpbin.org to inspect headers. Then paste the raw header text into this inspector for explanations.",
  },
];

export default function HttpHeadersTool() {
  const [input, setInput] = useState("");
  const [headers, setHeaders] = useState<ParsedHeader[]>([]);
  const [inspected, setInspected] = useState(false);

  const inspect = () => {
    if (!input.trim()) return;
    const parsed = parseHeaders(input);
    setHeaders(parsed);
    setInspected(true);
  };

  const securityScore = inspected
    ? SECURITY_HEADERS.filter((h) =>
        headers.some((ph) => ph.name.toLowerCase() === h)
      ).length
    : 0;

  const securityScoreMax = SECURITY_HEADERS.length;

  const scoreColor =
    securityScore >= 6
      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
      : securityScore >= 3
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";

  return (
    <ToolLayout
      title="HTTP Headers Inspector"
      description="Paste HTTP response headers and get plain-English explanations, categories, and a security score."
      slug="http-headers"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "Understanding HTTP Response Headers",
              content:
                "HTTP response headers are sent by the server before the response body. They control how the browser handles the response: whether to cache it, how to decode it, which scripts are allowed to run, and more. This inspector parses raw HTTP headers (copied from browser DevTools, curl output, or Postman) and provides a plain-English explanation for each header, its category (Security, Caching, CORS, Content, etc.), and a security score based on how many recommended security headers are present.",
            },
            {
              title: "Essential Security Headers for Your Website",
              content:
                "Every production website should include these security headers: Strict-Transport-Security (HSTS) to enforce HTTPS; Content-Security-Policy to prevent script injection; X-Frame-Options: SAMEORIGIN to block clickjacking; X-Content-Type-Options: nosniff to prevent MIME attacks; Referrer-Policy: strict-origin-when-cross-origin to protect privacy; Permissions-Policy to restrict unnecessary browser APIs. Missing these headers leaves your site exposed to common attacks. Use this tool to audit your current header configuration and identify gaps.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Paste HTTP Headers (raw format)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"content-type: application/json\ncache-control: no-cache\n..."}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-mono"
            rows={8}
            style={{ resize: "vertical" }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={inspect}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 btn-press"
          >
            Inspect Headers
          </button>
          <button
            onClick={() => {
              setInput(SAMPLE_HEADERS);
              setHeaders([]);
              setInspected(false);
            }}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Load Sample
          </button>

          {inspected && headers.length > 0 && (
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">
                {headers.length} headers found
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${scoreColor}`}
              >
                Security: {securityScore}/{securityScoreMax}
              </span>
            </div>
          )}
        </div>

        {inspected && headers.length === 0 && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-4 text-sm text-[var(--muted-foreground)]">
            No valid headers found. Make sure each header is on its own line in the format{" "}
            <code className="font-mono">Header-Name: value</code>.
          </div>
        )}

        {inspected && headers.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 text-xs">
              {(["Security", "Caching", "CORS", "Content", "Auth", "Cookie", "Other"] as HeaderCategory[]).map((cat) => {
                const count = headers.filter((h) => h.info?.category === cat || (!h.info && cat === "Other")).length;
                if (count === 0) return null;
                return (
                  <span
                    key={cat}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ${CATEGORY_COLORS[cat]}`}
                  >
                    {cat} ({count})
                  </span>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="pb-2 pr-4 text-left text-xs font-medium text-[var(--muted-foreground)] whitespace-nowrap">
                      Header
                    </th>
                    <th className="pb-2 pr-4 text-left text-xs font-medium text-[var(--muted-foreground)]">
                      Value
                    </th>
                    <th className="pb-2 pr-4 text-left text-xs font-medium text-[var(--muted-foreground)] whitespace-nowrap">
                      Category
                    </th>
                    <th className="pb-2 text-left text-xs font-medium text-[var(--muted-foreground)]">
                      Explanation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {headers.map((header, i) => {
                    const category: HeaderCategory = header.info?.category ?? "Other";
                    return (
                      <tr
                        key={i}
                        className="border-b border-[var(--border)] last:border-0 align-top"
                      >
                        <td className="py-3 pr-4 font-mono font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {header.name}
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs break-all max-w-[200px]">
                          {header.value}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
                          >
                            {category}
                          </span>
                        </td>
                        <td className="py-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
                          {header.info?.explanation ?? (
                            <span className="italic">
                              No explanation available for this header.
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {securityScore < securityScoreMax && (
              <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
                <p className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-400">
                  Missing security headers ({securityScoreMax - securityScore} of {securityScoreMax}):
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-xs text-yellow-700 dark:text-yellow-500">
                  {SECURITY_HEADERS.filter(
                    (h) => !headers.some((ph) => ph.name.toLowerCase() === h)
                  ).map((h) => (
                    <li key={h} className="font-mono">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
