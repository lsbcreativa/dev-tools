"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const faqs = [
  {
    question: "What is a Base64 image?",
    answer:
      "A Base64 image is a binary image file (PNG, JPEG, GIF, WebP, etc.) that has been encoded into a text string using Base64 encoding. The resulting string can be embedded directly in HTML, CSS, or JSON without requiring a separate file request. It is prefixed with a data URI like `data:image/png;base64,` followed by the encoded data.",
  },
  {
    question: "How do I get an image's Base64 string?",
    answer:
      "You can convert an image to Base64 using our Image to Base64 tool on this site, via browser DevTools (right-click → Copy image as data URI), or programmatically using the FileReader API in JavaScript. Many image editors and online converters also support exporting as Base64.",
  },
  {
    question: "Can I use a Base64 image in CSS backgrounds?",
    answer:
      "Yes. You can use a Base64-encoded data URI directly as a CSS background-image value: `background-image: url('data:image/png;base64,...')`. This is useful for small icons or textures where you want to avoid an extra HTTP request, but for large images it increases CSS file size significantly.",
  },
  {
    question: "Base64 vs file URLs — which is better?",
    answer:
      "File URLs (e.g. `/images/logo.png`) are better for large images because browsers can cache them separately. Base64 data URIs are useful for small images like icons or thumbnails where you want to reduce HTTP requests. Base64 encoding increases file size by about 33%, so it is not recommended for large images.",
  },
];

function normalizeBase64(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("/9j/")) return `data:image/jpeg;base64,${trimmed}`;
  if (trimmed.startsWith("iVBORw")) return `data:image/png;base64,${trimmed}`;
  if (trimmed.startsWith("R0lGOD")) return `data:image/gif;base64,${trimmed}`;
  if (trimmed.startsWith("UklGR")) return `data:image/webp;base64,${trimmed}`;
  return `data:image/png;base64,${trimmed}`;
}

function detectFormat(dataUri: string): string {
  const match = dataUri.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
  if (match) return match[1].toUpperCase();
  return "Unknown";
}

function estimateFileSize(base64: string): string {
  const raw = base64.replace(/^data:[^;]+;base64,/, "");
  const bytes = Math.floor(raw.length * 0.75);
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function Base64ImageTool() {
  const [input, setInput] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [error, setError] = useState("");
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handlePreview = (value?: string) => {
    const raw = (value ?? input).trim();
    if (!raw) {
      setDataUri("");
      setError("");
      setDimensions(null);
      return;
    }
    setError("");
    setDimensions(null);
    try {
      const uri = normalizeBase64(raw);
      // Basic validation — attempt to verify base64 portion is parseable
      const b64part = uri.replace(/^data:[^;]+;base64,/, "");
      atob(b64part.slice(0, 100)); // throws if invalid
      setDataUri(uri);
    } catch {
      setDataUri("");
      setError("Invalid Base64 string. Please check your input and try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    handlePreview(e.target.value);
  };

  const rawBase64 = dataUri.replace(/^data:[^;]+;base64,/, "");

  return (
    <ToolLayout
      title="Base64 Image Viewer & Decoder"
      description="Paste a Base64 image string and preview it instantly in your browser. Detect format, dimensions, and file size."
      slug="base64-image"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Preview Base64 Images Online",
              content:
                "Paste your Base64 string — with or without the data URI prefix (e.g. data:image/png;base64,) — into the text area above. The tool automatically detects the image format from magic bytes or the prefix, constructs a valid data URI, and renders the image live in your browser. No data is ever uploaded to a server. All processing happens locally in your browser, keeping your images completely private.",
            },
            {
              title: "Understanding Base64 Image Encoding",
              content:
                "Base64 encoding converts binary image data into a string of ASCII characters that can be safely transmitted in text-based formats like HTML, CSS, and JSON. Each group of 3 bytes is represented by 4 Base64 characters, resulting in a 33% size increase. Common formats (PNG, JPEG, GIF, WebP) can all be Base64-encoded. The data URI format (`data:image/png;base64,...`) lets browsers render these strings directly as image sources without any network requests.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Paste Base64 string
          </label>
          <textarea
            value={input}
            onChange={handleChange}
            placeholder="Paste a Base64 string here, with or without the data:image/...;base64, prefix..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 resize-y"
            rows={5}
            spellCheck={false}
          />
        </div>

        <button
          onClick={() => handlePreview()}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity btn-press"
        >
          Preview Image
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Preview & Info */}
        {dataUri && (
          <div className="space-y-4">
            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Format</div>
                <div className="text-sm font-semibold">{detectFormat(dataUri)}</div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Est. Size</div>
                <div className="text-sm font-semibold">{estimateFileSize(dataUri)}</div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center col-span-2 sm:col-span-1">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Dimensions</div>
                <div className="text-sm font-semibold">
                  {dimensions ? `${dimensions.w} × ${dimensions.h} px` : "Loading..."}
                </div>
              </div>
            </div>

            {/* Image preview */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 flex items-center justify-center min-h-[120px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={dataUri}
                alt="Base64 preview"
                className="max-w-full rounded"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
                }}
                onError={() => {
                  setError("Could not render image. The Base64 data may be corrupt or the format unsupported.");
                  setDataUri("");
                }}
              />
            </div>

            {/* Copy buttons */}
            <div className="flex flex-wrap gap-2">
              <CopyButton text={dataUri} label="Copy Data URI" />
              <CopyButton text={rawBase64} label="Copy Base64 Only" />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
