"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageToBase64Tool() {
  const [dataUri, setDataUri] = useState("");
  const [rawBase64, setRawBase64] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError("");
    setDataUri("");
    setRawBase64("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, GIF, SVG, WebP, etc.).");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum size is 5 MB.`);
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setDataUri(result);
      setMimeType(file.type);
      // Extract raw base64 (remove the data:...;base64, prefix)
      const base64 = result.split(",")[1] || "";
      setRawBase64(base64);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleClear = () => {
    setDataUri("");
    setRawBase64("");
    setMimeType("");
    setFileName("");
    setFileSize(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const htmlImgTag = dataUri ? `<img src="${dataUri}" alt="${fileName}" />` : "";
  const cssBackground = dataUri ? `background-image: url('${dataUri}');` : "";

  const faqs = [
    {
      question: "Does Base64 increase file size?",
      answer: "Yes. Base64 encoding increases the data size by approximately 33% because it converts binary data (8 bits) to ASCII characters (6 bits per character). A 10KB image becomes roughly 13.3KB in Base64.",
    },
    {
      question: "What is a data URI?",
      answer: "A data URI (data:image/png;base64,...) embeds file data directly in HTML or CSS instead of referencing an external URL. It combines the MIME type and Base64-encoded content into a single string.",
    },
    {
      question: "Should I Base64-encode all my images?",
      answer: "No. Base64 is best for small images under 10KB (icons, small logos). Larger images should be served as separate files to benefit from browser caching, lazy loading, and modern formats like WebP or AVIF.",
    },
  ];

  return (
    <ToolLayout
      title="Image to Base64 Converter"
      description="Convert images to Base64 encoded strings for embedding in HTML, CSS, and more."
      slug="image-to-base64"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert Images to Base64",
              content: "Drag and drop an image or click to upload, and get the Base64-encoded data URI instantly. The tool shows the encoded string and provides ready-to-use formats: raw Base64, data URI for HTML img tags, CSS background-image property, and Markdown image syntax. Supported formats include PNG, JPEG, GIF, WebP, and SVG.",
            },
            {
              title: "When to Use Base64-Encoded Images",
              content: "Base64 encoding embeds image data directly in HTML, CSS, or JSON, eliminating extra HTTP requests. This is beneficial for small images (icons, logos under 10KB), email HTML templates (where external images may be blocked), CSS sprites replacement, and embedding images in single-file applications. However, Base64 increases file size by approximately 33%, so it's not recommended for large images.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
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
            {dragging ? "Drop your image here" : "Click to select or drag & drop an image"}
          </p>
          <p className="mt-1 text-xs">PNG, JPG, GIF, SVG, WebP up to 5 MB</p>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {dataUri && (
        <>
          {/* Preview & stats */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="shrink-0">
              <label className="mb-1 block text-sm font-medium">Preview</label>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2 inline-block">
                <img
                  src={dataUri}
                  alt={fileName}
                  className="max-h-40 max-w-full rounded object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">File Info</label>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm space-y-1">
                <p><span className="font-medium">Name:</span> {fileName}</p>
                <p><span className="font-medium">Type:</span> {mimeType}</p>
                <p><span className="font-medium">Original size:</span> {formatBytes(fileSize)}</p>
                <p><span className="font-medium">Base64 length:</span> {rawBase64.length.toLocaleString()} characters</p>
                <p><span className="font-medium">Data URI length:</span> {dataUri.length.toLocaleString()} characters</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Clear
          </button>

          {/* Data URI */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Data URI</span>
              <CopyButton text={dataUri} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-32 whitespace-pre-wrap break-all">
              {dataUri}
            </pre>
          </div>

          {/* Raw Base64 */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Raw Base64</span>
              <CopyButton text={rawBase64} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-32 whitespace-pre-wrap break-all">
              {rawBase64}
            </pre>
          </div>

          {/* HTML img tag */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">HTML &lt;img&gt; Tag</span>
              <CopyButton text={htmlImgTag} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-32 whitespace-pre-wrap break-all">
              {htmlImgTag}
            </pre>
          </div>

          {/* CSS background-image */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">CSS background-image</span>
              <CopyButton text={cssBackground} />
            </div>
            <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-32 whitespace-pre-wrap break-all">
              {cssBackground}
            </pre>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
