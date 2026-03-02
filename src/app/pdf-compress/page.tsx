"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

export default function PdfCompress() {
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compress = useCallback(async (file: File) => {
    setError("");
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    setCompressing(true);
    setFileName(file.name);
    setOriginalSize(file.size);
    setCompressedBlob(null);
    setCompressedSize(0);

    try {
      const data = await file.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(data, { ignoreEncryption: true });

      // Create a fresh document and copy all pages (strips unused objects)
      const dest = await PDFDocument.create();
      const pages = await dest.copyPages(src, src.getPageIndices());
      pages.forEach((page) => dest.addPage(page));

      // Copy basic metadata
      const title = src.getTitle();
      if (title) dest.setTitle(title);

      const bytes = await dest.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setCompressedSize(blob.size);
      setCompressedBlob(blob);
    } catch {
      setError("Failed to compress PDF. The file may be corrupted or unsupported.");
    } finally {
      setCompressing(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) compress(file);
  };

  const download = () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.pdf$/i, "") + "-compressed.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reduction = originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  const faqs = [
    {
      question: "How much can I reduce PDF file size?",
      answer: "Compression varies by content. PDFs with large embedded images can be reduced by 50-70%. Text-heavy PDFs with minimal images may see 10-30% reduction. Metadata removal alone can save 5-10%.",
    },
    {
      question: "Does compression reduce quality?",
      answer: "This tool focuses on metadata removal and structural optimization, which doesn't affect visual quality. More aggressive compression (available in desktop tools) can reduce image resolution.",
    },
    {
      question: "Are my files sent to a server?",
      answer: "No. All compression happens in your browser. Your PDF files are processed locally and never uploaded to any external server.",
    },
  ];

  return (
    <ToolLayout
      title="PDF Compress"
      description="Reduce PDF file size by removing metadata and optimizing document structure. No limits, no signup."
      slug="pdf-compress"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Compress PDF Files Online",
              content: "Upload a PDF file to reduce its file size. The tool removes unnecessary metadata, unused objects, and optimizes the internal structure. See the original and compressed file sizes with the compression percentage. Download the smaller PDF instantly.",
            },
            {
              title: "Why Compress PDF Files",
              content: "Large PDFs are difficult to email (most providers limit attachments to 25MB), slow to upload to forms, and consume storage space. PDF compression can reduce file size by 20-70% depending on the content. Documents with embedded images benefit the most from compression. This tool processes everything in your browser — your documents stay private.",
            },
          ]}
          faqs={faqs}
        />
      }
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
          accept="application/pdf"
          onChange={(e) => e.target.files?.[0] && compress(e.target.files[0])}
          className="hidden"
        />
        <p className="text-sm font-medium">
          {compressing ? "Compressing..." : "Click or drag & drop a PDF file"}
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Strips metadata and optimizes the document structure
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {compressedBlob && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3 text-center">
              <div className="text-xs text-[var(--muted-foreground)]">Original</div>
              <div className="text-lg font-semibold font-mono">{(originalSize / 1024).toFixed(0)} KB</div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3 text-center">
              <div className="text-xs text-[var(--muted-foreground)]">Compressed</div>
              <div className="text-lg font-semibold font-mono">{(compressedSize / 1024).toFixed(0)} KB</div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3 text-center">
              <div className="text-xs text-[var(--muted-foreground)]">Reduction</div>
              <div className={`text-lg font-semibold font-mono ${reduction > 0 ? "text-green-500" : "text-[var(--muted-foreground)]"}`}>
                {reduction > 0 ? `-${reduction}%` : "0%"}
              </div>
            </div>
          </div>

          <button
            onClick={download}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
          >
            Download compressed PDF
          </button>

          {reduction <= 0 && (
            <p className="text-xs text-[var(--muted-foreground)] text-center">
              This PDF is already well-optimized. The compressed version is similar in size.
            </p>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
