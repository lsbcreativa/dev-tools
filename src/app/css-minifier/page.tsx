"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const SAMPLE_CSS = `/* ==========================================================================
   Global Reset & Base Styles
   ========================================================================== */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a2e;
  background-color: #ffffff;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5em;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

a {
  color: #6366f1;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Card Component */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.card__body {
  color: #64748b;
  line-height: 1.6;
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn--primary {
  background-color: #6366f1;
  color: #ffffff;
}

.btn--primary:hover {
  background-color: #4f46e5;
}

.btn--secondary {
  background-color: #f1f5f9;
  color: #334155;
}

.btn--secondary:hover {
  background-color: #e2e8f0;
}

/* Responsive Grid */
.grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .container {
    padding: 0 2rem;
  }
}

/* Utility classes */
.text-center { text-align: center; }
.text-muted { color: #94a3b8; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.hidden { display: none; }`;

function minifyCss(css: string): string {
  let result = css;

  // Remove CSS comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove newlines and collapse whitespace
  result = result.replace(/\s+/g, " ");

  // Remove spaces around special characters
  result = result.replace(/\s*{\s*/g, "{");
  result = result.replace(/\s*}\s*/g, "}");
  result = result.replace(/\s*:\s*/g, ":");
  result = result.replace(/\s*;\s*/g, ";");
  result = result.replace(/\s*,\s*/g, ",");

  // Remove last semicolon before closing brace
  result = result.replace(/;}/g, "}");

  // Trim
  result = result.trim();

  return result;
}

function beautifyCss(css: string): string {
  // First minify to normalize
  const minified = minifyCss(css);

  let result = "";
  let depth = 0;
  const indent = "  ";
  let i = 0;

  while (i < minified.length) {
    const ch = minified[i];

    if (ch === "{") {
      result += " {\n";
      depth++;
      i++;
    } else if (ch === "}") {
      depth--;
      // Remove trailing whitespace on previous line
      result = result.replace(/\s+$/, "");
      if (!result.endsWith("\n")) {
        result += "\n";
      }
      result += indent.repeat(depth) + "}\n";
      // Add blank line between top-level rule blocks
      if (depth === 0) {
        result += "\n";
      }
      i++;
    } else if (ch === ";") {
      result += ";\n";
      i++;
    } else if (ch === ",") {
      // Check if we're inside a selector (not inside braces for a property value)
      // Simple heuristic: if depth is 0 or we haven't seen a colon since last { or ;
      result += ",\n" + indent.repeat(depth);
      i++;
    } else if (ch === ":") {
      result += ": ";
      i++;
    } else {
      // Start of a new declaration or selector
      if (result.endsWith("\n") || result === "") {
        result += indent.repeat(depth);
      }
      result += ch;
      i++;
    }
  }

  // Clean up: fix selector indentation for lines at depth 0
  const lines = result.split("\n");
  const cleaned: string[] = [];

  for (let j = 0; j < lines.length; j++) {
    let line = lines[j];

    // Fix colon in selectors (like a:hover) -- don't add space after : in selectors
    // Heuristic: if a line doesn't contain { and doesn't end with ; it's likely a selector
    // But we need to fix pseudo-selectors that got space added
    line = line.replace(
      /: :(hover|focus|active|visited|first-child|last-child|nth-child|before|after|not|first-of-type|last-of-type|focus-within|focus-visible|placeholder|root)/g,
      "::$1"
    );
    line = line.replace(
      /: (hover|focus|active|visited|first-child|last-child|nth-child|before|after|not|first-of-type|last-of-type|focus-within|focus-visible|placeholder|root)/g,
      ":$1"
    );

    // Fix double colons that became : :
    line = line.replace(/: : /g, "::");

    cleaned.push(line);
  }

  result = cleaned.join("\n");

  // Clean up multiple blank lines
  result = result.replace(/\n{3,}/g, "\n\n");

  // Trim trailing whitespace
  result = result.trim();

  return result;
}

export default function CssMinifierTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const originalSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const difference = originalSize - outputSize;
  const percentChange = originalSize > 0 ? ((difference / originalSize) * 100).toFixed(1) : "0";

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      setOutput(minifyCss(input));
    } catch {
      setOutput("/* Error minifying CSS */");
    }
  };

  const handleBeautify = () => {
    if (!input.trim()) return;
    try {
      setOutput(beautifyCss(input));
    } catch {
      setOutput("/* Error beautifying CSS */");
    }
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_CSS);
    setOutput("");
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: "Does CSS minification break anything?",
      answer: "No. Minification only removes whitespace, comments, and unnecessary semicolons/characters. All CSS rules and selectors remain functionally identical. Always test visually after minification.",
    },
    {
      question: "Should I minify CSS in development?",
      answer: "No. Keep CSS readable during development for easier debugging. Only minify for production builds. Most bundlers (Vite, webpack, Next.js) handle this automatically.",
    },
    {
      question: "What is the difference between minification and compression?",
      answer: "Minification removes unnecessary characters from the source code. Compression (gzip/brotli) is a server-level encoding that further reduces transfer size. Use both together for maximum performance.",
    },
  ];

  return (
    <ToolLayout
      title="CSS Minifier / Beautifier"
      description="Minify CSS for production or beautify compressed CSS for readability."
      slug="css-minifier"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Minify and Beautify CSS",
              content: "Paste your CSS code to minify it (remove whitespace, comments, and unnecessary characters) or beautify it (add proper indentation and formatting). Minification reduces CSS file size for faster page loads, while beautification makes compressed CSS readable again for debugging and editing.",
            },
            {
              title: "CSS Optimization for Web Performance",
              content: "Minified CSS loads faster because browsers download fewer bytes. A typical CSS file can be reduced by 20-40% through minification alone. Combined with gzip/brotli compression on the server, total transfer size can be reduced by 80-90%. Modern build tools like PostCSS, cssnano, and Lightning CSS handle minification automatically in production builds.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleMinify}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
          >
            Minify
          </button>
          <button
            onClick={handleBeautify}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Beautify
          </button>
          <button
            onClick={handleLoadSample}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Load Sample
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Input CSS</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSS here..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm font-mono"
            rows={12}
          />
        </div>

        {output && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Output</span>
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
                >
                  Download .css
                </button>
              </div>
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}

        {input && (
          <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
            <span>Original: {originalSize.toLocaleString()} bytes</span>
            {output && (
              <>
                <span>Output: {outputSize.toLocaleString()} bytes</span>
                <span>
                  Difference: {difference > 0 ? "-" : difference < 0 ? "+" : ""}
                  {Math.abs(difference).toLocaleString()} bytes ({difference > 0 ? "-" : difference < 0 ? "+" : ""}
                  {percentChange}%)
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
