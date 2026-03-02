"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies, an evil sorceress, and her own childhood to become queen of the world.</description>
  </book>
  <book id="bk103">
    <author>Corets, Eva</author>
    <title>Maeve Ascendant</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-11-17</publish_date>
    <description>After the collapse of a nanotechnology society in England, the young survivors lay the foundation for a new society.</description>
  </book>
  <!-- More books can be added here -->
  <metadata>
    <total_books>3</total_books>
    <last_updated>2024-01-15</last_updated>
    <categories>
      <category>Computer</category>
      <category>Fantasy</category>
    </categories>
  </metadata>
</catalog>`;

function formatXml(xml: string, indentSize: number): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML: " + errorNode.textContent);
  }

  const indent = " ".repeat(indentSize);
  let result = "";

  function serializeNode(node: Node, level: number): string {
    let out = "";
    const prefix = indent.repeat(level);

    if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const pi = node as ProcessingInstruction;
      out += prefix + "<?" + pi.target + " " + pi.data + "?>\n";
    } else if (node.nodeType === Node.COMMENT_NODE) {
      out += prefix + "<!--" + node.nodeValue + "-->\n";
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.nodeValue || "").trim();
      if (text) {
        out += prefix + text + "\n";
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      out += prefix + "<" + el.tagName;

      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        out += " " + attr.name + '="' + attr.value + '"';
      }

      const children = Array.from(el.childNodes).filter((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          return (child.nodeValue || "").trim().length > 0;
        }
        return true;
      });

      if (children.length === 0) {
        out += "/>\n";
      } else if (
        children.length === 1 &&
        children[0].nodeType === Node.TEXT_NODE
      ) {
        out +=
          ">" + (children[0].nodeValue || "").trim() + "</" + el.tagName + ">\n";
      } else {
        out += ">\n";
        for (const child of children) {
          out += serializeNode(child, level + 1);
        }
        out += prefix + "</" + el.tagName + ">\n";
      }
    } else if (node.nodeType === Node.DOCUMENT_NODE) {
      for (const child of Array.from(node.childNodes)) {
        out += serializeNode(child, level);
      }
    }

    return out;
  }

  result = serializeNode(doc, 0);

  if (
    xml.trimStart().startsWith("<?xml") &&
    !result.startsWith("<?xml")
  ) {
    const match = xml.match(/<\?xml[^?]*\?>/);
    if (match) {
      result = match[0] + "\n" + result;
    }
  }

  return result.trimEnd();
}

function minifyXml(xml: string): string {
  let result = xml;
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  result = result.replace(/>\s+</g, "><");
  result = result.replace(/\s+/g, " ");
  result = result.replace(/>\s+/g, ">");
  result = result.replace(/\s+</g, "<");
  result = result.trim();
  return result;
}

function validateXml(xml: string): { valid: boolean; error?: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    return { valid: false, error: errorNode.textContent || "Unknown parse error" };
  }
  return { valid: true };
}

export default function XmlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [validation, setValidation] = useState<{
    valid: boolean;
    error?: string;
  } | null>(null);
  const [error, setError] = useState("");

  const originalSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;

  const handleBeautify = () => {
    setError("");
    setValidation(null);
    if (!input.trim()) return;
    try {
      const formatted = formatXml(input, indentSize);
      setOutput(formatted);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to beautify XML");
      setOutput("");
    }
  };

  const handleMinify = () => {
    setError("");
    setValidation(null);
    if (!input.trim()) return;
    try {
      const minified = minifyXml(input);
      setOutput(minified);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to minify XML");
      setOutput("");
    }
  };

  const handleValidate = () => {
    setError("");
    if (!input.trim()) return;
    const result = validateXml(input);
    setValidation(result);
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_XML);
    setOutput("");
    setValidation(null);
    setError("");
  };

  return (
    <ToolLayout
      title="XML Formatter & Validator"
      description="Beautify, minify, and validate your XML documents."
      slug="xml-formatter"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBeautify}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
          >
            Beautify
          </button>
          <button
            onClick={handleMinify}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Minify
          </button>
          <button
            onClick={handleValidate}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Validate
          </button>
          <button
            onClick={handleLoadSample}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Load Sample
          </button>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-[var(--muted-foreground)]">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Input XML</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your XML here..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm font-mono"
            rows={10}
          />
        </div>

        {validation && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              validation.valid
                ? "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]"
                : "border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)]"
            }`}
          >
            {validation.valid
              ? "Valid XML! The document is well-formed."
              : `Invalid XML: ${validation.error}`}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
            {error}
          </div>
        )}

        {output && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Output</span>
              <CopyButton text={output} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono whitespace-pre-wrap break-all overflow-x-auto">
              {output}
            </pre>
          </div>
        )}

        {input && (
          <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
            <span>Original: {originalSize.toLocaleString()} bytes</span>
            {output && (
              <span>Output: {outputSize.toLocaleString()} bytes</span>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
