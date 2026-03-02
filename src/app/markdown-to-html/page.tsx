"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const faqs = [
  {
    question: "What is Markdown?",
    answer:
      "Markdown is a lightweight markup language created by John Gruber in 2004. It uses simple, plain-text formatting syntax (like # for headings, ** for bold, and - for lists) that is designed to be readable as-is and easily converted to HTML. Markdown is widely used in README files, documentation platforms, static site generators, and content management systems.",
  },
  {
    question: "What is the difference between Markdown to HTML conversion and Markdown preview?",
    answer:
      "A Markdown preview renders the formatted output visually — showing styled headings, bold text, and formatted lists as they would appear in a browser. Markdown to HTML conversion instead shows you the raw HTML source code that is generated from the Markdown. This is useful when you need to embed the HTML in a web page, CMS, or email template.",
  },
  {
    question: "How do I use the HTML generated from Markdown?",
    answer:
      "You can copy the generated HTML and paste it directly into an HTML file, a CMS rich-text editor (in HTML/source mode), an email template, or any platform that accepts raw HTML. The generated HTML contains standard tags like <h1>, <p>, <strong>, <a>, <ul>, and <pre> that are supported by all modern browsers.",
  },
  {
    question: "What Markdown syntax is supported?",
    answer:
      "This tool supports the most common Markdown elements: headings (# H1, ## H2, ### H3), bold (**text**), italic (*text*), inline code (`code`), code blocks (```), links ([text](url)), images (![alt](src)), blockquotes (> text), unordered lists (- item), ordered lists (1. item), and paragraph separation via blank lines.",
  },
];

const DEFAULT_MD = `# Welcome to Markdown to HTML

This tool converts **Markdown** to raw HTML source code.

## Features

- Headings (H1, H2, H3)
- **Bold** and *italic* text
- \`Inline code\` and code blocks
- [Links](https://toolboxurl.com) and images
- Unordered and ordered lists
- Blockquotes

## Example code block

\`\`\`
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("World"));
\`\`\`

> Markdown was created by John Gruber in 2004.

1. Open the tool
2. Paste your Markdown
3. Copy the HTML output
`;

function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks first (before other replacements touch backticks)
  html = html.replace(/```[\w]*\n?([\s\S]*?)```/g, (_match, code) => {
    const escaped = code
      .trim()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre><code>${escaped}</code></pre>`;
  });

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Blockquote
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Bold (before italic)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images (before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered list items
  html = html.replace(/^[-*+] (.+)$/gm, "<li>$1</li>");

  // Ordered list items
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Wrap consecutive <li> items in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>\n${match}</ul>\n`);

  // Paragraphs: lines that are not already wrapped in a block tag
  const blockTags = /^<(h[1-6]|ul|ol|li|pre|blockquote|img)/;
  const lines = html.split("\n");
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      result.push("");
      i++;
    } else if (blockTags.test(line.trim())) {
      result.push(line);
      i++;
    } else {
      // Collect paragraph lines
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !blockTags.test(lines[i].trim())) {
        para.push(lines[i]);
        i++;
      }
      result.push(`<p>${para.join(" ")}</p>`);
    }
  }

  return result.join("\n");
}

function minifyHtml(html: string): string {
  return html
    .replace(/\n+/g, "")
    .replace(/>\s+</g, "><")
    .trim();
}

export default function MarkdownToHtmlTool() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [minify, setMinify] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const rawHtml = markdownToHtml(markdown);
  const outputHtml = minify ? minifyHtml(rawHtml) : rawHtml;

  const handleDownload = useCallback(() => {
    const blob = new Blob(
      [
        `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Converted from Markdown</title>\n</head>\n<body>\n${outputHtml}\n</body>\n</html>`,
      ],
      { type: "text/html" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [outputHtml]);

  return (
    <ToolLayout
      title="Markdown to HTML Converter"
      description="Convert Markdown to raw HTML source code instantly. Copy the output or download it as an .html file."
      slug="markdown-to-html"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert Markdown to HTML",
              content:
                "Type or paste your Markdown into the left panel. The tool converts it to HTML in real time and displays the raw source code on the right. You can enable 'Minify output' to strip whitespace for production use, or toggle 'Show preview' to see how the HTML renders visually in a browser. Use the 'Copy HTML' button to copy the output or 'Download .html' to save a complete HTML file.",
            },
            {
              title: "Markdown Syntax: Complete Reference",
              content:
                "This converter supports the core CommonMark/GFM Markdown syntax: # H1, ## H2, ### H3 for headings; **bold** and *italic* for emphasis; `code` for inline code and ``` blocks for fenced code; [text](url) for links and ![alt](url) for images; - or * for unordered lists and 1. 2. for ordered lists; > for blockquotes. Blank lines between content create paragraph (<p>) tags in the HTML output.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        {/* Options */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
            <input
              type="checkbox"
              checked={minify}
              onChange={(e) => setMinify(e.target.checked)}
              className="rounded border-[var(--border)] accent-[var(--primary)]"
            />
            <span className="font-medium">Minify output</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="rounded border-[var(--border)] accent-[var(--primary)]"
            />
            <span className="font-medium">Show rendered preview</span>
          </label>
        </div>

        {/* Two-panel editor */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Markdown input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Markdown input</label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="# Type your Markdown here..."
              className="w-full flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 resize-y"
              rows={18}
              spellCheck={false}
            />
          </div>

          {/* HTML output */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">HTML output</label>
              <div className="flex gap-2">
                <CopyButton text={outputHtml} label="Copy HTML" />
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium transition-all hover:bg-[var(--muted)] btn-press"
                >
                  Download .html
                </button>
              </div>
            </div>
            <pre className="w-full flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono text-[var(--foreground)] whitespace-pre-wrap break-all overflow-auto"
              style={{ minHeight: "18rem" }}
            >
              {outputHtml || <span className="text-[var(--muted-foreground)]">HTML will appear here...</span>}
            </pre>
          </div>
        </div>

        {/* Rendered preview */}
        {showPreview && (
          <div>
            <label className="mb-1.5 block text-sm font-medium">Rendered preview</label>
            <div
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-5 prose prose-sm max-w-none text-[var(--foreground)]"
              style={{
                lineHeight: "1.7",
              }}
              dangerouslySetInnerHTML={{ __html: rawHtml }}
            />
          </div>
        )}

        {/* Stats */}
        {markdown && (
          <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
            <span>
              Input chars: <strong className="text-[var(--foreground)]">{markdown.length}</strong>
            </span>
            <span>
              Output chars: <strong className="text-[var(--foreground)]">{outputHtml.length}</strong>
            </span>
            <span>
              Lines: <strong className="text-[var(--foreground)]">{markdown.split("\n").length}</strong>
            </span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
