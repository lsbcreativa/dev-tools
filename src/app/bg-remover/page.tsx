"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

export default function BgRemover() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setError("");
    setProcessing(true);
    setResultUrl("");
    setProgress("Loading AI model (first time may take a moment)...");
    setOriginalUrl(URL.createObjectURL(file));

    try {
      const { removeBackground } = await import("@imgly/background-removal");
      setProgress("Removing background...");
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (key === "compute:inference") {
            setProgress(`Processing... ${Math.round((current / total) * 100)}%`);
          }
        },
      });
      setResultUrl(URL.createObjectURL(blob));
      setProgress("");
    } catch {
      setError("Failed to remove background. Try a different image.");
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "no-background.png";
    a.click();
  };

  return (
    <ToolLayout
      title="Image Background Remover"
      description="Remove image backgrounds automatically using AI. Download transparent PNG. Runs entirely in your browser."
      slug="bg-remover"
    >
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          dragging
            ? "border-[var(--primary)] bg-[var(--primary)]/5"
            : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--muted)]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])}
          className="hidden"
        />
        <p className="text-sm font-medium">
          {processing ? progress : "Click or drag & drop an image"}
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Supports JPG, PNG, WebP. AI model downloads once and is cached.
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {(originalUrl || resultUrl) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {originalUrl && (
            <div>
              <span className="mb-2 block text-sm font-medium">Original</span>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original" className="w-full rounded object-contain max-h-80" />
              </div>
            </div>
          )}
          {resultUrl && (
            <div>
              <span className="mb-2 block text-sm font-medium">Background removed</span>
              <div className="rounded-lg border border-[var(--border)] p-2" style={{ backgroundImage: "repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%)", backgroundSize: "16px 16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Result" className="w-full rounded object-contain max-h-80" />
              </div>
            </div>
          )}
        </div>
      )}

      {resultUrl && (
        <button
          onClick={download}
          className="mt-4 w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Download transparent PNG
        </button>
      )}
    </ToolLayout>
  );
}
