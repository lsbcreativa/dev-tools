"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

interface StatusCode {
  code: number;
  name: string;
  description: string;
  useCase: string;
}

interface Category {
  label: string;
  range: string;
  color: string;
  bgColor: string;
  borderColor: string;
  codes: StatusCode[];
}

const STATUS_CODES: Category[] = [
  {
    label: "1xx Informational",
    range: "1xx",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/30",
    codes: [
      {
        code: 100,
        name: "Continue",
        description: "The server has received the request headers and the client should proceed to send the request body.",
        useCase: "Used in large file uploads where the client sends an Expect: 100-continue header before sending the body.",
      },
      {
        code: 101,
        name: "Switching Protocols",
        description: "The server is switching protocols as requested by the client via the Upgrade header.",
        useCase: "Used when upgrading an HTTP connection to a WebSocket connection.",
      },
      {
        code: 102,
        name: "Processing",
        description: "The server has received and is processing the request, but no response is available yet.",
        useCase: "Used in WebDAV to indicate that processing is ongoing and prevent client timeouts.",
      },
      {
        code: 103,
        name: "Early Hints",
        description: "Used to return some response headers before the final HTTP message.",
        useCase: "Allows the browser to preload resources while the server prepares the full response.",
      },
    ],
  },
  {
    label: "2xx Success",
    range: "2xx",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    codes: [
      {
        code: 200,
        name: "OK",
        description: "The request succeeded. The meaning depends on the HTTP method used.",
        useCase: "Standard response for successful GET, PUT, PATCH, or DELETE requests.",
      },
      {
        code: 201,
        name: "Created",
        description: "The request succeeded and a new resource was created as a result.",
        useCase: "Returned after a successful POST request that creates a new resource.",
      },
      {
        code: 202,
        name: "Accepted",
        description: "The request has been accepted for processing, but the processing has not been completed.",
        useCase: "Used for asynchronous operations like background job queues or batch processing.",
      },
      {
        code: 204,
        name: "No Content",
        description: "The server successfully processed the request but is not returning any content.",
        useCase: "Common response for successful DELETE requests or PUT updates with no response body.",
      },
      {
        code: 206,
        name: "Partial Content",
        description: "The server is delivering only part of the resource due to a range header sent by the client.",
        useCase: "Used for resumable downloads and media streaming with Range requests.",
      },
      {
        code: 207,
        name: "Multi-Status",
        description: "Conveys information about multiple resources in situations where multiple status codes might be appropriate.",
        useCase: "Used in WebDAV for operations affecting multiple resources.",
      },
    ],
  },
  {
    label: "3xx Redirection",
    range: "3xx",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    codes: [
      {
        code: 301,
        name: "Moved Permanently",
        description: "The resource has been permanently moved to a new URL. Future requests should use the new URL.",
        useCase: "Used for permanent URL changes, domain migrations, or enforcing canonical URLs.",
      },
      {
        code: 302,
        name: "Found",
        description: "The resource has been temporarily moved to a different URL.",
        useCase: "Used for temporary redirects during maintenance or A/B testing.",
      },
      {
        code: 303,
        name: "See Other",
        description: "The server is redirecting the client to a different resource using a GET request.",
        useCase: "Used after form submission (POST-Redirect-GET pattern) to prevent duplicate submissions.",
      },
      {
        code: 304,
        name: "Not Modified",
        description: "The resource has not been modified since the last request with conditional headers.",
        useCase: "Used with If-Modified-Since or ETag headers for browser caching optimization.",
      },
      {
        code: 307,
        name: "Temporary Redirect",
        description: "The resource has been temporarily moved, and the request method must not change.",
        useCase: "Used when the redirect must preserve the original HTTP method (POST stays POST).",
      },
      {
        code: 308,
        name: "Permanent Redirect",
        description: "The resource has been permanently moved, and the request method must not change.",
        useCase: "Used for permanent redirects that must preserve the HTTP method.",
      },
    ],
  },
  {
    label: "4xx Client Error",
    range: "4xx",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    codes: [
      {
        code: 400,
        name: "Bad Request",
        description: "The server cannot process the request due to a client error such as malformed syntax.",
        useCase: "Returned when request validation fails, e.g. missing required fields or invalid JSON.",
      },
      {
        code: 401,
        name: "Unauthorized",
        description: "The request requires authentication. The client must authenticate itself to get the response.",
        useCase: "Returned when a request lacks valid authentication credentials or a token is expired.",
      },
      {
        code: 403,
        name: "Forbidden",
        description: "The client does not have permission to access the requested resource.",
        useCase: "Returned when the user is authenticated but lacks the necessary permissions.",
      },
      {
        code: 404,
        name: "Not Found",
        description: "The server cannot find the requested resource. The URL is not recognized.",
        useCase: "Returned when a resource does not exist or the endpoint is invalid.",
      },
      {
        code: 405,
        name: "Method Not Allowed",
        description: "The HTTP method used is not supported for the requested resource.",
        useCase: "Returned when sending a DELETE request to an endpoint that only supports GET.",
      },
      {
        code: 406,
        name: "Not Acceptable",
        description: "The server cannot produce a response matching the Accept headers sent by the client.",
        useCase: "Returned when content negotiation fails between client and server.",
      },
      {
        code: 408,
        name: "Request Timeout",
        description: "The server timed out waiting for the request from the client.",
        useCase: "Returned when the client takes too long to send the complete request.",
      },
      {
        code: 409,
        name: "Conflict",
        description: "The request conflicts with the current state of the server.",
        useCase: "Returned during concurrent update conflicts or duplicate resource creation.",
      },
      {
        code: 410,
        name: "Gone",
        description: "The resource is no longer available and will not be available again.",
        useCase: "Used to indicate permanently deleted resources, helping search engines de-index pages.",
      },
      {
        code: 413,
        name: "Payload Too Large",
        description: "The request payload exceeds the maximum size the server is willing to process.",
        useCase: "Returned when an uploaded file exceeds the server's size limit.",
      },
      {
        code: 415,
        name: "Unsupported Media Type",
        description: "The media format of the request data is not supported by the server.",
        useCase: "Returned when sending XML to an endpoint that only accepts JSON.",
      },
      {
        code: 418,
        name: "I'm a Teapot",
        description: "The server refuses to brew coffee because it is, permanently, a teapot.",
        useCase: "An April Fools' joke from RFC 2324. Sometimes used as an Easter egg in APIs.",
      },
      {
        code: 422,
        name: "Unprocessable Entity",
        description: "The server understands the content type but cannot process the instructions contained within.",
        useCase: "Returned when request data is well-formed but semantically invalid (e.g. business rule violations).",
      },
      {
        code: 429,
        name: "Too Many Requests",
        description: "The user has sent too many requests in a given amount of time (rate limiting).",
        useCase: "Used to enforce API rate limits. Often includes a Retry-After header.",
      },
      {
        code: 431,
        name: "Request Header Fields Too Large",
        description: "The server refuses to process the request because the headers are too large.",
        useCase: "Returned when cookies or other headers exceed the server's size limit.",
      },
      {
        code: 451,
        name: "Unavailable For Legal Reasons",
        description: "The resource is unavailable due to legal demands such as government censorship.",
        useCase: "Used when content is blocked due to legal restrictions like DMCA takedowns or court orders.",
      },
    ],
  },
  {
    label: "5xx Server Error",
    range: "5xx",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    codes: [
      {
        code: 500,
        name: "Internal Server Error",
        description: "The server encountered an unexpected condition that prevented it from fulfilling the request.",
        useCase: "A generic catch-all for unhandled server exceptions or bugs.",
      },
      {
        code: 501,
        name: "Not Implemented",
        description: "The server does not support the functionality required to fulfill the request.",
        useCase: "Returned when the server does not recognize the request method or cannot fulfill it.",
      },
      {
        code: 502,
        name: "Bad Gateway",
        description: "The server, while acting as a gateway, received an invalid response from the upstream server.",
        useCase: "Common with reverse proxies (Nginx, load balancers) when the backend is down.",
      },
      {
        code: 503,
        name: "Service Unavailable",
        description: "The server is not ready to handle the request, usually due to maintenance or overload.",
        useCase: "Used during planned maintenance or when the server is temporarily overloaded.",
      },
      {
        code: 504,
        name: "Gateway Timeout",
        description: "The server, while acting as a gateway, did not receive a timely response from the upstream server.",
        useCase: "Common when a backend service takes too long to respond through a proxy.",
      },
      {
        code: 507,
        name: "Insufficient Storage",
        description: "The server is unable to store the representation needed to complete the request.",
        useCase: "Used in WebDAV when the server runs out of storage space.",
      },
      {
        code: 511,
        name: "Network Authentication Required",
        description: "The client needs to authenticate to gain network access.",
        useCase: "Used by captive portals (Wi-Fi login pages) to intercept traffic and require authentication.",
      },
    ],
  },
];

export default function HttpStatusCodes() {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (range: string) => {
    setCollapsed((prev) => ({ ...prev, [range]: !prev[range] }));
  };

  const filteredCategories = STATUS_CODES.map((category) => {
    const filteredCodes = category.codes.filter((code) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        String(code.code).includes(q) ||
        code.name.toLowerCase().includes(q) ||
        code.description.toLowerCase().includes(q) ||
        code.useCase.toLowerCase().includes(q)
      );
    });
    return { ...category, codes: filteredCodes };
  }).filter((category) => category.codes.length > 0);

  const faqs = [
    {
      question: "What is the difference between 401 and 403?",
      answer: "401 Unauthorized means the client is not authenticated — no credentials provided or invalid credentials. 403 Forbidden means the client is authenticated but doesn't have permission to access the resource.",
    },
    {
      question: "When should I use 301 vs 302 redirects?",
      answer: "Use 301 (Moved Permanently) when a page has permanently moved — search engines will transfer SEO value. Use 302 (Found) for temporary redirects — the original URL retains its SEO value.",
    },
    {
      question: "What does a 429 status code mean?",
      answer: "429 Too Many Requests indicates the client has sent too many requests in a given time period (rate limiting). The response usually includes a Retry-After header indicating when to try again.",
    },
  ];

  return (
    <ToolLayout
      title="HTTP Status Codes Reference"
      description="Complete reference of HTTP status codes with descriptions and common use cases."
      slug="http-status-codes"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "HTTP Status Code Reference",
              content: "Search or browse the complete list of HTTP status codes with descriptions and use cases. Codes are organized by category: 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error). Each code includes when to use it and common scenarios where it appears.",
            },
            {
              title: "Most Important HTTP Status Codes for Developers",
              content: "200 OK — successful request. 201 Created — resource created (POST). 301 Moved Permanently — permanent redirect (SEO-safe). 302 Found — temporary redirect. 400 Bad Request — malformed request. 401 Unauthorized — authentication required. 403 Forbidden — authenticated but not authorized. 404 Not Found — resource doesn't exist. 429 Too Many Requests — rate limited. 500 Internal Server Error — server-side failure. 503 Service Unavailable — server temporarily down.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code number, name, or description..."
            className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
          />
        </div>

        {/* Categories */}
        {filteredCategories.map((category) => (
          <div key={category.range}>
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category.range)}
              className={`w-full flex items-center justify-between rounded-lg border ${category.borderColor} ${category.bgColor} px-4 py-3 text-left transition-all hover:opacity-80 btn-press`}
            >
              <span className={`text-sm font-bold ${category.color}`}>
                {category.label}
              </span>
              <span className={`text-xs ${category.color}`}>
                {collapsed[category.range] ? "+" : "-"} {category.codes.length} code{category.codes.length !== 1 ? "s" : ""}
              </span>
            </button>

            {/* Codes list */}
            {!collapsed[category.range] && (
              <div className="mt-2 space-y-2">
                {category.codes.map((code) => (
                  <div
                    key={code.code}
                    className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${category.bgColor} ${category.color}`}
                          >
                            {code.code}
                          </span>
                          <span className="text-sm font-semibold">
                            {code.name}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                          {code.description}
                        </p>
                        <p className="mt-1.5 text-xs text-[var(--muted-foreground)] leading-relaxed">
                          <span className="font-medium text-[var(--foreground)]">Use case:</span>{" "}
                          {code.useCase}
                        </p>
                      </div>
                      <CopyButton
                        text={`${code.code} ${code.name}`}
                        label=""
                        className="shrink-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-6 text-center text-sm text-[var(--muted-foreground)]">
            No status codes found matching &quot;{search}&quot;.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
