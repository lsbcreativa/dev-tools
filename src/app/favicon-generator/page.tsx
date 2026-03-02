"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";
import CopyButton from "@/components/tools/CopyButton";

const SIZES = [16, 32, 48, 64, 128, 512];

function renderFaviconToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  bgColor: string,
  textColor: string,
  fontSize: number,
  size: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  // Background
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.15);
  ctx.fill();

  if (!text) return;

  // Text
  const scaledFontSize = Math.round((fontSize / 100) * size * 0.85);
  ctx.fillStyle = textColor;
  ctx.font = `bold ${scaledFontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.slice(0, 3), size / 2, size / 2 + size * 0.02);
}

const faqs = [
  {
    question: "What size should a favicon be?",
    answer:
      "Modern browsers use 32×32 or 48×48 pixels for browser tabs. Apple devices use 180×180 for Apple Touch Icons (home screen bookmarks). Android home screen shortcuts use 192×192 or larger. For the best cross-platform coverage, generate multiple sizes and reference them in your HTML.",
  },
  {
    question: "What format is best for favicons?",
    answer:
      "PNG is universally supported and handles transparency cleanly, making it the recommended format for modern sites. ICO format bundles multiple sizes into a single file and is still used for legacy IE compatibility. SVG favicons are supported by modern browsers and scale perfectly at any resolution.",
  },
  {
    question: "How do I add a favicon to my website?",
    answer:
      "Place the favicon file in your site's root directory, then add this tag inside your HTML <head>: <link rel=\"icon\" href=\"/favicon.png\" type=\"image/png\">. For Apple devices, also add: <link rel=\"apple-touch-icon\" href=\"/apple-touch-icon.png\">. Most frameworks like Next.js support placing a favicon.ico or icon.png directly in the app directory.",
  },
  {
    question: "Can I use emoji as a favicon?",
    answer:
      "Yes! Emoji work great as favicons, especially in modern browsers. Just type or paste an emoji into the text field — it renders as a single character and looks crisp at all sizes. This is a popular quick-branding technique for side projects and personal sites.",
  },
];

export default function FaviconGenerator() {
  const [text, setText] = useState("AB");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(60);
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const [dataUrls, setDataUrls] = useState<Record<number, string>>({});

  const renderAll = useCallback(() => {
    const urls: Record<number, string> = {};
    for (const size of SIZES) {
      const canvas = canvasRefs.current[size];
      if (canvas) {
        renderFaviconToCanvas(canvas, text, bgColor, textColor, fontSize, size);
        urls[size] = canvas.toDataURL("image/png");
      }
    }
    setDataUrls(urls);
  }, [text, bgColor, textColor, fontSize]);

  useEffect(() => {
    renderAll();
  }, [renderAll]);

  const downloadSize = (size: number) => {
    const url = dataUrls[size];
    if (!url) return;
    const a = document.createElement("a");
    a.download = `favicon-${size}x${size}.png`;
    a.href = url;
    a.click();
  };

  const downloadAll = () => {
    // Download the 512px version as the primary high-res PNG
    downloadSize(512);
  };

  return (
    <ToolLayout
      title="Favicon Generator"
      description="Generate favicons from text, emoji, or initials. Download as PNG in all standard sizes."
      slug="favicon-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Create a Favicon Online",
              content:
                "Enter up to 3 characters — text, initials, or an emoji — then choose your background and text colors using the color pickers. Adjust the font size slider until the text fits perfectly. The preview grid updates live showing all 6 standard sizes. Click any individual size button to download that specific PNG, or use Download All to get the 512×512 master file. All rendering happens entirely in your browser using the Canvas API — nothing is uploaded to any server.",
            },
            {
              title: "Favicon Sizes: The Complete Guide",
              content:
                "Different platforms require different favicon sizes. 16×16 is the classic browser tab size still used by many desktop browsers. 32×32 is the standard modern tab icon and Windows taskbar size. 48×48 is used by Windows site-specific browsers. 64×64 works for Windows taskbar shortcuts. 128×128 is used by the Chrome Web Store and some desktop app contexts. 180×180 is the Apple Touch Icon size for iOS home screen bookmarks. 192×192 and 512×512 are the Android Chrome PWA manifest sizes. Generating all sizes ensures your favicon looks sharp everywhere.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Text / Emoji / Initials{" "}
              <span className="text-[var(--muted-foreground)]">(max 3 chars)</span>
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 3))}
              placeholder="AB or 🚀"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
              maxLength={3}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Font Size{" "}
              <span className="text-[var(--muted-foreground)]">({fontSize}%)</span>
            </label>
            <input
              type="range"
              min={20}
              max={90}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--primary)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-[var(--border)]"
              />
              <span className="text-sm font-mono text-[var(--muted-foreground)]">{bgColor}</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-[var(--border)]"
              />
              <span className="text-sm font-mono text-[var(--muted-foreground)]">{textColor}</span>
            </div>
          </div>
        </div>

        {/* Hidden canvases for rendering */}
        <div className="hidden">
          {SIZES.map((size) => (
            <canvas
              key={size}
              ref={(el) => {
                canvasRefs.current[size] = el;
              }}
              width={size}
              height={size}
            />
          ))}
        </div>

        {/* Preview Grid */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Preview &amp; Download
          </h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4">
            <div className="flex flex-wrap gap-6 items-end">
              {SIZES.map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <div
                    className="rounded border border-[var(--card-border)] bg-[var(--card)] flex items-center justify-center overflow-hidden"
                    style={{ width: Math.max(size, 32), height: Math.max(size, 32) }}
                  >
                    {dataUrls[size] && (
                      <img
                        src={dataUrls[size]}
                        alt={`${size}x${size} preview`}
                        width={size}
                        height={size}
                        style={{ imageRendering: size < 48 ? "pixelated" : "auto" }}
                      />
                    )}
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {size}×{size}
                  </span>
                  <button
                    onClick={() => downloadSize(size)}
                    className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs font-medium hover:bg-[var(--background)] btn-press transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download All */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadAll}
            className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
          >
            Download 512×512 PNG
          </button>
          <span className="text-xs text-[var(--muted-foreground)]">
            Downloads the 512×512 master file — resize it for any use case
          </span>
        </div>

        {/* Usage snippet */}
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            HTML Snippet
          </h2>
          <div className="relative rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
            <pre className="text-xs font-mono text-[var(--foreground)] overflow-x-auto whitespace-pre-wrap">
{`<link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
<link rel="icon" href="/favicon-512.png" type="image/png" sizes="512x512">`}
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton
                text={`<link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">\n<link rel="icon" href="/favicon-512.png" type="image/png" sizes="512x512">`}
              />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
