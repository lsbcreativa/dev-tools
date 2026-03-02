"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

const THEMES: Record<string, { bg: string; text: string; keyword: string; string: string; comment: string; number: string; border: string; label: string }> = {
  dracula: { bg: "#282a36", text: "#f8f8f2", keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4", number: "#bd93f9", border: "#44475a", label: "Dracula" },
  monokai: { bg: "#272822", text: "#f8f8f2", keyword: "#f92672", string: "#e6db74", comment: "#75715e", number: "#ae81ff", border: "#3e3d32", label: "Monokai" },
  githubDark: { bg: "#0d1117", text: "#e6edf3", keyword: "#ff7b72", string: "#a5d6ff", comment: "#8b949e", number: "#79c0ff", border: "#30363d", label: "GitHub Dark" },
  oneDark: { bg: "#282c34", text: "#abb2bf", keyword: "#c678dd", string: "#98c379", comment: "#5c6370", number: "#d19a66", border: "#3e4451", label: "One Dark" },
};

const PADDINGS = [16, 32, 48, 64];

const BACKGROUNDS = [
  { value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", label: "Purple" },
  { value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", label: "Pink" },
  { value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", label: "Blue" },
  { value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", label: "Green" },
  { value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", label: "Sunset" },
  { value: "transparent", label: "None" },
];

const DEFAULT_CODE = `function fibonacci(n) {
  // Base cases
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

console.log(fibonacci(10)); // 55`;

export default function CodeToImage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [theme, setTheme] = useState<keyof typeof THEMES>("dracula");
  const [background, setBackground] = useState(BACKGROUNDS[0].value);
  const [padding, setPadding] = useState(32);
  const [title, setTitle] = useState("fibonacci.js");
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const t = THEMES[theme];

  const exportImage = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "code.png";
      a.click();
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  };

  return (
    <ToolLayout
      title="Code to Image"
      description="Generate beautiful code screenshots with custom themes and backgrounds. Like Carbon.sh but free and unlimited."
      slug="code-to-image"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
              rows={12}
              spellCheck={false}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
                placeholder="filename.js"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as keyof typeof THEMES)}
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
              >
                {Object.entries(THEMES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Background</label>
              <div className="flex flex-wrap gap-2">
                {BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.label}
                    onClick={() => setBackground(bg.value)}
                    className={`h-8 w-8 rounded-md border-2 transition-all ${
                      background === bg.value ? "border-[var(--primary)] scale-110" : "border-[var(--border)]"
                    }`}
                    style={{ background: bg.value === "transparent" ? "repeating-conic-gradient(#80808040 0% 25%, transparent 0% 50%)" : bg.value }}
                    title={bg.label}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Padding</label>
              <select
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
              >
                {PADDINGS.map((p) => (
                  <option key={p} value={p}>{p}px</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={exportImage}
            disabled={exporting || !code.trim()}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export as PNG"}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6">
        <span className="mb-2 block text-sm font-medium">Preview</span>
        <div className="overflow-auto rounded-lg border border-[var(--border)]">
          <div ref={previewRef} style={{ background, padding, display: "inline-block", minWidth: "100%" }}>
            <div style={{ background: t.bg, borderRadius: 12, border: `1px solid ${t.border}`, overflow: "hidden", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace" }}>
              {/* Title bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
                </div>
                {title && <span style={{ fontSize: 13, color: t.comment, marginLeft: 8 }}>{title}</span>}
              </div>
              {/* Code */}
              <pre style={{ margin: 0, padding: 16, fontSize: 14, lineHeight: 1.6, color: t.text, overflow: "auto" }}>
                {code}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
