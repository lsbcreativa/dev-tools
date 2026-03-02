"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_QUERY = `# Get user with their posts
query GetUserWithPosts($userId: ID!, $limit: Int = 10) {
  user(id: $userId) {
    id
    name
    email
    profile {
      bio
      avatarUrl
      joinedAt
    }
    posts(first: $limit, orderBy: CREATED_AT_DESC) {
      edges {
        node {
          id
          title
          publishedAt
          tags { name }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}

mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    post { id title }
    errors { field message }
  }
}`;

type GraphQLMode = "query" | "schema";

function formatGraphQL(input: string): string {
  // Remove # comments
  const noComments = input
    .split("\n")
    .map((line) => {
      let inStr = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') inStr = !inStr;
        if (line[i] === "#" && !inStr) return line.slice(0, i).trimEnd();
      }
      return line;
    })
    .join("\n");

  // Tokenize
  const tokens: string[] = [];
  let i = 0;
  const src = noComments;

  while (i < src.length) {
    const ch = src[i];

    // Whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // String literal (triple-quoted or regular)
    if (ch === '"') {
      if (src[i + 1] === '"' && src[i + 2] === '"') {
        // Block string
        const end = src.indexOf('"""', i + 3);
        if (end === -1) {
          tokens.push(src.slice(i));
          break;
        }
        tokens.push(src.slice(i, end + 3));
        i = end + 3;
      } else {
        let j = i + 1;
        while (j < src.length && src[j] !== '"') {
          if (src[j] === "\\") j++;
          j++;
        }
        tokens.push(src.slice(i, j + 1));
        i = j + 1;
      }
      continue;
    }

    // Single-char tokens
    if ("{}()[]!:=|&@".includes(ch)) {
      tokens.push(ch);
      i++;
      continue;
    }

    // Multi-char tokens (names, directives, fragments)
    if (/[a-zA-Z_$0-9\-\.]/.test(ch)) {
      let j = i;
      while (j < src.length && /[a-zA-Z_$0-9\-\.]/.test(src[j])) j++;
      tokens.push(src.slice(i, j));
      i = j;
      continue;
    }

    // Spread (...)
    if (ch === "." && src[i + 1] === "." && src[i + 2] === ".") {
      tokens.push("...");
      i += 3;
      continue;
    }

    i++;
  }

  // Reconstruct with indentation
  let out = "";
  let indent = 0;
  const INDENT = "  ";

  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t];
    const next = tokens[t + 1] ?? "";

    if (tok === "}") {
      indent = Math.max(0, indent - 1);
      out += INDENT.repeat(indent) + "}\n";
    } else if (tok === "{") {
      out += " {\n";
      indent++;
    } else if (tok === "(") {
      out += "(";
    } else if (tok === ")") {
      out += ")";
      if (next === "{") {
        // handled when we see {
      }
    } else if (tok === ":") {
      out += ": ";
    } else if (tok === "=") {
      out += " = ";
    } else if (tok === "!") {
      out += "!";
    } else if (tok === "|") {
      out += " | ";
    } else if (tok === "&") {
      out += " & ";
    } else if (tok === "@") {
      out += "@";
    } else if (tok === ",") {
      out += ", ";
    } else if (tok === "[") {
      out += "[";
    } else if (tok === "]") {
      out += "]";
    } else if (tok === "...") {
      out += INDENT.repeat(indent) + "...";
    } else {
      // Normal identifier / keyword / value
      const prevTrimmed = out.trimEnd();
      const lastChar = prevTrimmed[prevTrimmed.length - 1] ?? "";
      // Start a new line for field-level tokens
      const onNewLine =
        lastChar === "\n" ||
        out === "" ||
        prevTrimmed.endsWith("{");

      if (onNewLine) {
        out += INDENT.repeat(indent) + tok;
      } else if (
        lastChar === "(" ||
        lastChar === "@" ||
        lastChar === "[" ||
        lastChar === "!" ||
        out.endsWith(": ") ||
        out.endsWith("= ") ||
        out.endsWith("| ") ||
        out.endsWith("& ") ||
        out.endsWith("...")
      ) {
        out += tok;
      } else {
        out += " " + tok;
      }
    }
  }

  return out.trim();
}

function minifyGraphQL(input: string): string {
  // Remove comments
  const noComments = input
    .split("\n")
    .map((line) => {
      let inStr = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') inStr = !inStr;
        if (line[i] === "#" && !inStr) return line.slice(0, i);
      }
      return line;
    })
    .join(" ");

  return noComments
    .replace(/\s+/g, " ")
    .replace(/\s*([{}()\[\]:!,=|&@])\s*/g, "$1")
    .replace(/,/g, " ")
    .trim();
}

const faqs = [
  {
    question: "What is GraphQL?",
    answer:
      "GraphQL is a query language for APIs developed by Facebook (now Meta) in 2015. Unlike REST, where the server defines fixed response shapes, GraphQL lets clients specify exactly what data they need. A GraphQL API exposes a single endpoint and accepts queries, mutations (data changes), and subscriptions (real-time updates). It uses a strongly-typed schema to describe available data.",
  },
  {
    question: "Why format GraphQL queries?",
    answer:
      "Formatted GraphQL queries are easier to read, review, and maintain. Proper indentation makes the nested structure of selections clear at a glance. When sharing queries in documentation or code reviews, formatted GraphQL reduces cognitive load. Minified GraphQL reduces payload size for API requests. Many GraphQL clients like Apollo and urql accept both formatted and minified queries.",
  },
  {
    question: "What is the difference between a query, mutation, and subscription in GraphQL?",
    answer:
      "A query retrieves data from the server (read-only, like GET in REST). A mutation modifies server-side data (like POST, PUT, or DELETE). A subscription establishes a long-lived connection for real-time data updates pushed from the server to the client. All three use the same GraphQL syntax with different operation keywords.",
  },
  {
    question: "How do I format a GraphQL schema definition?",
    answer:
      "GraphQL schemas use SDL (Schema Definition Language) with types, fields, and directives. This formatter handles both query operations and schema definitions. Paste your schema SDL (with type, input, enum, interface, union keywords) and click Format. The formatter applies consistent 2-space indentation and places each field on its own line.",
  },
];

export default function GraphqlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<GraphQLMode>("query");

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const formatted = formatGraphQL(input);
      setOutput(formatted);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to format GraphQL");
      setOutput("");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const minified = minifyGraphQL(input);
      setOutput(minified);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to minify GraphQL");
      setOutput("");
    }
  };

  return (
    <ToolLayout
      title="GraphQL Formatter & Prettifier"
      description="Format, prettify and minify GraphQL queries, mutations, and schema definitions online."
      slug="graphql-formatter"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Format GraphQL Queries",
              content:
                "Paste your GraphQL query, mutation, subscription, or schema definition into the input field. Click Format / Prettify to apply consistent 2-space indentation and place each field on its own line. Click Minify to compress the GraphQL into a single line, removing all comments and extra whitespace. The formatted output can be copied to clipboard. Use the Query/Schema toggle to indicate what you're formatting — both modes use the same formatter, but the label helps you keep track.",
            },
            {
              title: "GraphQL Query Formatting Best Practices",
              content:
                "Well-formatted GraphQL queries follow these conventions: each field on its own line, opening braces on the same line as the operation or type, 2-space indentation per nesting level, arguments in parentheses on the same line as the field, and directives inline with their field. Comments (#) should document complex selections. For production codebases, store queries as named operations (query MyQuery { ... }) rather than anonymous queries, enabling better error messages and query logging on the server.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 btn-press"
          >
            Format / Prettify
          </button>
          <button
            onClick={handleMinify}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Minify
          </button>
          <button
            onClick={() => {
              setInput(SAMPLE_QUERY);
              setOutput("");
              setError("");
            }}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Load Sample
          </button>
          <div className="ml-auto flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-1">
            <button
              onClick={() => setMode("query")}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                mode === "query"
                  ? "bg-[var(--card)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Query
            </button>
            <button
              onClick={() => setMode("schema")}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                mode === "schema"
                  ? "bg-[var(--card)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Schema
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              GraphQL {mode === "query" ? "Query / Mutation" : "Schema SDL"} Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "query"
                  ? "query { user(id: 1) { name email } }"
                  : "type User {\n  id: ID!\n  name: String!\n}"
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-mono"
              rows={16}
              style={{ resize: "vertical" }}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium">Formatted Output</label>
              {output && <CopyButton text={output} />}
            </div>
            {error ? (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            ) : (
              <pre className="min-h-[16rem] overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono whitespace-pre-wrap break-all">
                {output || (
                  <span className="text-[var(--muted-foreground)]">
                    Formatted output will appear here...
                  </span>
                )}
              </pre>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
