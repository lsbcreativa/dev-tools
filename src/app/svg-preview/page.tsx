"use client";

import { useState, useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <!-- A sample shape -->
  <metadata>
    <title>Sample SVG</title>
  </metadata>
  <rect x="10" y="10" width="180" height="180" rx="20" fill="#3b82f6" opacity="0.9" />
  <circle cx="100" cy="100" r="50" fill="#ffffff" />
</svg>`;

function optimizeSvg(svg: string): string {
  let result = svg;

  // Remove XML declarations
  result = result.replace(/<\?xml[^?]*\?>\s*/gi, "");

  // Remove XML comments
  result = result.replace(/<!--[\s\S]*?-->/g, "");

  // Remove metadata elements
  result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");

  // Remove empty attributes (attr="")
  result = result.replace(/\s+\w+=""\s*/g, " ");

  // Collapse multiple whitespace/newlines to single spaces
  result = result.replace(/\s{2,}/g, " ");

  // Remove unnecessary whitespace between tags
  result = result.replace(/>\s+</g, "><");

  // Trim
  result = result.trim();

  return result;
}

function isValidSvg(svg: string): boolean {
  const trimmed = svg.trim();
  if (!trimmed) return false;
  // Basic check: must contain an <svg tag
  return /<svg[\s>]/i.test(trimmed) && /<\/svg\s*>/i.test(trimmed);
}

function byteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export default function SvgPreviewOptimizer() {
  const [input, setInput] = useState(DEFAULT_SVG);
  const [optimized, setOptimized] = useState("");
  const [showOptimized, setShowOptimized] = useState(false);

  const valid = useMemo(() => isValidSvg(input), [input]);

  const handleOptimize = () => {
    if (!valid) return;
    const result = optimizeSvg(input);
    setOptimized(result);
    setShowOptimized(true);
  };

  const originalSize = byteSize(input);
  const optimizedSize = showOptimized ? byteSize(optimized) : 0;
  const reduction =
    showOptimized && originalSize > 0
      ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
      : 0;

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="SVG Preview & Optimizer"
      description="Preview and optimize SVG code. Remove comments, metadata, and unnecessary whitespace. Download optimized SVG files."
      slug="svg-preview"
    >
      {/* SVG Input */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium">SVG Code</label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowOptimized(false);
          }}
          rows={10}
          spellCheck={false}
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          placeholder="Paste your SVG code here..."
        />
        <div className="mt-1 text-xs text-[var(--muted-foreground)]">
          Size: {originalSize} bytes
        </div>
      </div>

      {/* Error */}
      {input.trim() && !valid && (
        <div className="mb-6 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          Invalid SVG: The input must contain a valid &lt;svg&gt; element with a closing &lt;/svg&gt; tag.
        </div>
      )}

      {/* Preview */}
      {valid && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">Preview</label>
          <div
            className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 overflow-auto"
            style={{ minHeight: 200 }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(showOptimized ? optimized : input, { USE_PROFILES: { svg: true, svgFilters: true }, ADD_TAGS: ["use"], FORBID_TAGS: ["script"], FORBID_ATTR: ["onload", "onerror", "onclick", "onmouseover", "onfocus", "onblur"] }) }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={handleOptimize}
          disabled={!valid}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Optimize
        </button>
        <button
          onClick={() => handleDownload(showOptimized ? optimized : input, "image.svg")}
          disabled={!valid}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download .svg
        </button>
      </div>

      {/* Optimized Output */}
      {showOptimized && (
        <div className="mt-6">
          {/* Stats */}
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3 text-center">
              <div className="text-xs text-[var(--muted-foreground)]">Original</div>
              <div className="text-lg font-semibold font-mono">{originalSize} B</div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3 text-center">
              <div className="text-xs text-[var(--muted-foreground)]">Optimized</div>
              <div className="text-lg font-semibold font-mono">{optimizedSize} B</div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3 text-center">
              <div className="text-xs text-[var(--muted-foreground)]">Reduction</div>
              <div className="text-lg font-semibold font-mono">{reduction}%</div>
            </div>
          </div>

          {/* Optimized SVG Code */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Optimized SVG</span>
            <CopyButton text={optimized} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {optimized}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
