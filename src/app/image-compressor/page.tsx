"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

/* ---------- Helpers ---------- */

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const FORMAT_OPTIONS: { label: string; value: OutputFormat; ext: string }[] = [
  { label: "JPEG", value: "image/jpeg", ext: "jpg" },
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "WebP", value: "image/webp", ext: "webp" },
];

/* ---------- Component ---------- */

export default function ImageCompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [originalDimensions, setOriginalDimensions] = useState({
    w: 0,
    h: 0,
  });
  const [compressedUrl, setCompressedUrl] = useState("");
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedDimensions, setCompressedDimensions] = useState({
    w: 0,
    h: 0,
  });
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");

  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compress = useCallback(
    (
      file: File,
      q: number,
      mw: string,
      mh: string,
      fmt: OutputFormat
    ) => {
      setProcessing(true);
      setError("");

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        setOriginalDimensions({ w: img.naturalWidth, h: img.naturalHeight });
        setOriginalUrl(url);

        let targetW = img.naturalWidth;
        let targetH = img.naturalHeight;

        const parsedMaxW = mw ? parseInt(mw, 10) : 0;
        const parsedMaxH = mh ? parseInt(mh, 10) : 0;

        if (parsedMaxW > 0 && targetW > parsedMaxW) {
          const ratio = parsedMaxW / targetW;
          targetW = parsedMaxW;
          targetH = Math.round(targetH * ratio);
        }

        if (parsedMaxH > 0 && targetH > parsedMaxH) {
          const ratio = parsedMaxH / targetH;
          targetH = parsedMaxH;
          targetW = Math.round(targetW * ratio);
        }

        const canvas = canvasRef.current || document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Could not get canvas context.");
          setProcessing(false);
          return;
        }

        ctx.clearRect(0, 0, targetW, targetH);
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const qualityValue = q / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Compression failed. Try a different format.");
              setProcessing(false);
              return;
            }

            // Revoke previous compressed URL
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);

            const newUrl = URL.createObjectURL(blob);
            setCompressedUrl(newUrl);
            setCompressedSize(blob.size);
            setCompressedBlob(blob);
            setCompressedDimensions({ w: targetW, h: targetH });
            setProcessing(false);
          },
          fmt,
          fmt === "image/png" ? undefined : qualityValue
        );
      };

      img.onerror = () => {
        setError("Failed to load image. Please try a different file.");
        setProcessing(false);
      };

      img.src = url;
    },
    [compressedUrl]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      setOriginalFile(file);
      setError("");
      compress(file, quality, maxWidth, maxHeight, format);
    },
    [compress, quality, maxWidth, maxHeight, format]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const recompress = useCallback(() => {
    if (originalFile) {
      compress(originalFile, quality, maxWidth, maxHeight, format);
    }
  }, [originalFile, compress, quality, maxWidth, maxHeight, format]);

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(null);
    setOriginalUrl("");
    setOriginalDimensions({ w: 0, h: 0 });
    setCompressedUrl("");
    setCompressedSize(0);
    setCompressedDimensions({ w: 0, h: 0 });
    setCompressedBlob(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const ext =
      FORMAT_OPTIONS.find((f) => f.value === format)?.ext || "jpg";
    const name = originalFile
      ? originalFile.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`
      : `compressed.${ext}`;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reduction =
    originalFile && compressedSize > 0
      ? Math.round((1 - compressedSize / originalFile.size) * 100)
      : 0;

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress and resize images in your browser. 100% client-side - your images never leave your device."
      slug="image-compressor"
    >
      {/* Hidden canvas for compression */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Drop zone */}
      {!originalFile && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
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
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-[var(--muted-foreground)]">
            <p className="text-sm font-medium">
              {dragging
                ? "Drop your image here"
                : "Click to select or drag & drop an image"}
            </p>
            <p className="mt-1 text-xs">
              JPEG, PNG, WebP, GIF, BMP, and more
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Settings and preview */}
      {originalFile && (
        <>
          {/* Controls */}
          <div className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
            <h3 className="mb-3 text-sm font-medium">Compression Settings</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Quality */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                  <span>1%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Max Width */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                  Max Width (px)
                </label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  placeholder="Original"
                  min={1}
                  className="w-full rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
                />
              </div>

              {/* Max Height */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                  Max Height (px)
                </label>
                <input
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
                  placeholder="Original"
                  min={1}
                  className="w-full rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
                />
              </div>

              {/* Format */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className="w-full rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
                >
                  {FORMAT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={recompress}
                disabled={processing}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 btn-press"
              >
                {processing ? "Compressing..." : "Recompress"}
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
              >
                Remove Image
              </button>
            </div>
          </div>

          {/* Stats */}
          {compressedSize > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center">
                <div className="text-xs text-[var(--muted-foreground)]">
                  Original Size
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {formatBytes(originalFile.size)}
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center">
                <div className="text-xs text-[var(--muted-foreground)]">
                  Compressed Size
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {formatBytes(compressedSize)}
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center">
                <div className="text-xs text-[var(--muted-foreground)]">
                  Reduction
                </div>
                <div
                  className={`mt-1 text-sm font-semibold ${
                    reduction > 0
                      ? "text-[var(--success)]"
                      : reduction < 0
                        ? "text-[var(--destructive)]"
                        : ""
                  }`}
                >
                  {reduction > 0 ? `-${reduction}%` : reduction < 0 ? `+${Math.abs(reduction)}%` : "0%"}
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center">
                <div className="text-xs text-[var(--muted-foreground)]">
                  Dimensions
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {compressedDimensions.w} x {compressedDimensions.h}
                </div>
              </div>
            </div>
          )}

          {/* Side-by-side preview */}
          {compressedUrl && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Original */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Original</span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {originalDimensions.w} x {originalDimensions.h} &middot;{" "}
                      {formatBytes(originalFile.size)}
                    </span>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2 flex items-center justify-center min-h-[200px]">
                    <img
                      src={originalUrl}
                      alt="Original"
                      className="max-w-full max-h-64 object-contain rounded"
                    />
                  </div>
                </div>

                {/* Compressed */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Compressed</span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {compressedDimensions.w} x {compressedDimensions.h}{" "}
                      &middot; {formatBytes(compressedSize)}
                    </span>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2 flex items-center justify-center min-h-[200px]">
                    <img
                      src={compressedUrl}
                      alt="Compressed"
                      className="max-w-full max-h-64 object-contain rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Download */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleDownload}
                  className="rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 btn-press"
                >
                  Download Compressed Image
                </button>
              </div>
            </>
          )}
        </>
      )}
    </ToolLayout>
  );
}
