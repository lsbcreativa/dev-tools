"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function parseMarkdown(md: string): string {
  let html = md;

  // Escape HTML entities
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Code blocks (``` ... ```)
  html = html.replace(/```([\s\S]*?)```/g, (_match, code) => {
    return `<pre class="bg-[var(--muted)] rounded-lg p-3 font-mono text-sm overflow-x-auto my-2"><code>${code.trim()}</code></pre>`;
  });

  // Inline code (`code`)
  html = html.replace(/`([^`\n]+)`/g, '<code class="bg-[var(--muted)] rounded px-1.5 py-0.5 text-sm font-mono">$1</code>');

  // Headings
  html = html.replace(/^###### (.+)$/gm, '<h6 class="text-sm font-bold mt-4 mb-1">$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5 class="text-sm font-bold mt-4 mb-1">$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-base font-bold mt-4 mb-1">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-4 border-[var(--border)]" />');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-[var(--primary)] pl-4 my-2 italic text-[var(--muted-foreground)]">$1</blockquote>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded my-2" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--primary)] underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Unordered lists (- or *)
  html = html.replace(/^(?:[-*]) (.+)$/gm, '<li class="ml-4">$1</li>');
  html = html.replace(/((?:<li class="ml-4">.*<\/li>\n?)+)/g, '<ul class="list-disc pl-4 my-2">$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>');
  html = html.replace(/((?:<li class="ml-4">.*<\/li>\n?)+)/g, (match) => {
    if (match.includes("list-disc")) return match;
    return `<ul class="list-decimal pl-4 my-2">${match}</ul>`;
  });

  // Paragraphs: wrap remaining lines that aren't already HTML tags
  html = html
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return line;
      return `<p class="my-1">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

const defaultMarkdown = `# Markdown Preview

## Getting Started

This is a **bold** statement and this is *italic* text.

Here is some \`inline code\` in a sentence.

### Code Block

\`\`\`
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Lists

Unordered list:
- First item
- Second item
- Third item

Ordered list:
1. Step one
2. Step two
3. Step three

### Links & Images

[Visit GitHub](https://github.com)

![Placeholder](https://via.placeholder.com/150)

### Blockquote

> This is a blockquote. It can contain **formatted** text.

---

That's it! Start typing on the left to see the preview update in real time.`;

export default function MarkdownPreview() {
  const [input, setInput] = useState(defaultMarkdown);

  const rendered = useMemo(() => parseMarkdown(input), [input]);

  return (
    <ToolLayout
      title="Markdown Preview"
      description="Write markdown and preview the rendered output in real time."
      slug="markdown-preview"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Markdown Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your markdown here..."
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={20}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium">Preview</span>
            <CopyButton text={input} label="Copy MD" />
          </div>
          <div
            className="h-full min-h-[20rem] rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm overflow-y-auto prose-sm"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
