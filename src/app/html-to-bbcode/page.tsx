"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- Sample HTML ---------- */

const SAMPLE_HTML = `<h1>Welcome to My Post</h1>
<p>This is a <strong>bold</strong> and <em>italic</em> example with <u>underline</u> and <s>strikethrough</s> text.</p>

<h2>Features</h2>
<ul>
  <li>Easy to use converter</li>
  <li>Supports <b>nested <i>formatting</i></b></li>
  <li>Handles links and images</li>
</ul>

<h3>Ordered Steps</h3>
<ol>
  <li>Paste your HTML</li>
  <li>Get BBCode instantly</li>
  <li>Copy and paste to your forum</li>
</ol>

<p>Visit <a href="https://example.com">our website</a> for more info.</p>

<blockquote>This is a quoted block of text that someone important said.</blockquote>

<p>Here is some <code>inline code</code> and a code block:</p>
<pre>function hello() {
  console.log("Hello, World!");
}</pre>

<p>Check out this image:</p>
<img src="https://via.placeholder.com/150" />

<p><span style="color: red">This text is red</span> and <span style="color: #0066ff">this is blue</span>.</p>`;

/* ---------- HTML to BBCode converter using DOMParser ---------- */

function htmlToBBCode(html: string): string {
  if (!html.trim()) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function walkNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Recursively process children
    const childContent = Array.from(el.childNodes)
      .map((child) => walkNode(child))
      .join("");

    switch (tag) {
      case "b":
      case "strong":
        return `[b]${childContent}[/b]`;

      case "i":
      case "em":
        return `[i]${childContent}[/i]`;

      case "u":
        return `[u]${childContent}[/u]`;

      case "s":
      case "del":
      case "strike":
        return `[s]${childContent}[/s]`;

      case "a": {
        const href = el.getAttribute("href") || "";
        return `[url=${href}]${childContent}[/url]`;
      }

      case "img": {
        const src = el.getAttribute("src") || "";
        return `[img]${src}[/img]`;
      }

      case "h1":
        return `[size=7]${childContent}[/size]\n\n`;
      case "h2":
        return `[size=6]${childContent}[/size]\n\n`;
      case "h3":
        return `[size=5]${childContent}[/size]\n\n`;
      case "h4":
        return `[size=4]${childContent}[/size]\n\n`;
      case "h5":
        return `[size=3]${childContent}[/size]\n\n`;
      case "h6":
        return `[size=2]${childContent}[/size]\n\n`;

      case "ul": {
        const items = Array.from(el.children)
          .filter((c) => c.tagName.toLowerCase() === "li")
          .map((li) => `[*]${walkNode(li).trim()}`)
          .join("\n");
        return `[list]\n${items}\n[/list]\n`;
      }

      case "ol": {
        const items = Array.from(el.children)
          .filter((c) => c.tagName.toLowerCase() === "li")
          .map((li) => `[*]${walkNode(li).trim()}`)
          .join("\n");
        return `[list=1]\n${items}\n[/list]\n`;
      }

      case "li":
        return childContent;

      case "blockquote":
        return `[quote]${childContent.trim()}[/quote]\n`;

      case "code":
        return `[code]${childContent}[/code]`;

      case "pre":
        return `[code]${el.textContent || ""}[/code]\n`;

      case "span": {
        const style = el.getAttribute("style") || "";
        const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
        if (colorMatch) {
          return `[color=${colorMatch[1].trim()}]${childContent}[/color]`;
        }
        return childContent;
      }

      case "p":
        return `${childContent}\n\n`;

      case "br":
        return "\n";

      case "div":
        return `${childContent}\n`;

      // Pass-through for structural tags
      case "html":
      case "head":
      case "body":
        return childContent;

      default:
        return childContent;
    }
  }

  const result = walkNode(doc.body);

  // Clean up excessive newlines
  return result.replace(/\n{3,}/g, "\n\n").trim();
}

/* ---------- Component ---------- */

export default function HtmlToBBCodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = useCallback((html: string) => {
    setInput(html);
    setOutput(htmlToBBCode(html));
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    setOutput(htmlToBBCode(value));
  };

  return (
    <ToolLayout
      title="HTML to BBCode Converter"
      description="Convert HTML markup to BBCode format for forums and message boards."
      slug="html-to-bbcode"
    >
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleConvert(SAMPLE_HTML)}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
        >
          Load Sample
        </button>
        <button
          onClick={() => {
            setInput("");
            setOutput("");
          }}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
        >
          Clear
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div>
          <label className="mb-1 block text-sm font-medium">HTML Input</label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your HTML here..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
            rows={18}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">BBCode Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="BBCode output will appear here..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
            rows={18}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Reference */}
      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
        <h3 className="mb-2 text-sm font-medium">Supported Conversions</h3>
        <div className="grid grid-cols-1 gap-1 text-xs font-mono sm:grid-cols-2">
          {[
            ["<b>, <strong>", "[b]...[/b]"],
            ["<i>, <em>", "[i]...[/i]"],
            ["<u>", "[u]...[/u]"],
            ["<s>, <del>, <strike>", "[s]...[/s]"],
            ['<a href="url">', "[url=url]...[/url]"],
            ['<img src="url">', "[img]url[/img]"],
            ["<h1> to <h6>", "[size=7] to [size=2]"],
            ["<ul> + <li>", "[list]...[/list]"],
            ["<ol> + <li>", "[list=1]...[/list]"],
            ["<blockquote>", "[quote]...[/quote]"],
            ["<code>, <pre>", "[code]...[/code]"],
            ['<span style="color:X">', "[color=X]...[/color]"],
          ].map(([html, bbcode]) => (
            <div key={html} className="flex gap-2">
              <span className="text-[var(--primary)] font-medium min-w-[160px]">
                {html}
              </span>
              <span className="text-[var(--muted-foreground)]">{bbcode}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
