"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

interface PdfFile {
  name: string;
  size: number;
  data: ArrayBuffer;
  pages: number;
}

export default function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (fileList: FileList) => {
    setError("");
    const newFiles: PdfFile[] = [];
    for (const file of Array.from(fileList)) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are accepted.");
        continue;
      }
      try {
        const data = await file.arrayBuffer();
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
        newFiles.push({
          name: file.name,
          size: file.size,
          data,
          pages: pdf.getPageCount(),
        });
      } catch {
        setError(`Failed to read ${file.name}. It may be corrupted.`);
      }
    }
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (from: number, to: number) => {
    setFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const merge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const file of files) {
        const src = await PDFDocument.load(file.data, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to merge PDFs. Some files may be unsupported.");
    } finally {
      setMerging(false);
    }
  };

  const totalPages = files.reduce((sum, f) => sum + f.pages, 0);

  const faqs = [
    {
      question: "Is there a limit on the number of PDFs I can merge?",
      answer: "There is no hard limit on file count. However, very large PDFs (over 50MB total) may cause slower processing since everything runs in your browser's memory.",
    },
    {
      question: "Will merging change the quality of my PDFs?",
      answer: "No. The merge operation combines PDF pages without re-encoding or compressing them. All text, images, fonts, and formatting remain exactly as in the original files.",
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No. All processing happens entirely in your browser using JavaScript. Your PDF files never leave your device. This is safer than cloud-based alternatives.",
    },
  ];

  return (
    <ToolLayout
      title="PDF Merge"
      description="Combine multiple PDF files into a single document. Drag to reorder. No limits, no signup."
      slug="pdf-merge"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Merge PDF Files Online",
              content: "Upload multiple PDF files, drag to reorder them, and combine them into a single PDF document. The merged file maintains the original quality, formatting, and page sizes of each source PDF. Download the result instantly — no file size limits, no watermarks, and no signup required.",
            },
            {
              title: "Why Merge PDFs Client-Side",
              content: "Unlike most PDF tools that upload your files to remote servers, this tool processes everything in your browser using pdf-lib. Your documents never leave your device, making it safe for confidential contracts, financial documents, medical records, and any sensitive content. There are no upload limits, no waiting for server processing, and no privacy concerns.",
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
          multiple
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="hidden"
        />
        <p className="text-sm font-medium">Click or drag & drop PDF files here</p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">You can add multiple files at once</p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{files.length} files — {totalPages} pages total</span>
            <button onClick={() => setFiles([])} className="text-xs text-[var(--destructive)] hover:underline">
              Clear all
            </button>
          </div>
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 px-3 py-2">
              <span className="text-xs font-mono text-[var(--muted-foreground)] w-6 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{file.pages} pages — {(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => i > 0 && moveFile(i, i - 1)}
                  disabled={i === 0}
                  className="rounded p-1 text-xs hover:bg-[var(--muted)] disabled:opacity-30"
                  title="Move up"
                >▲</button>
                <button
                  onClick={() => i < files.length - 1 && moveFile(i, i + 1)}
                  disabled={i === files.length - 1}
                  className="rounded p-1 text-xs hover:bg-[var(--muted)] disabled:opacity-30"
                  title="Move down"
                >▼</button>
                <button
                  onClick={() => removeFile(i)}
                  className="rounded p-1 text-xs text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
                  title="Remove"
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Merge button */}
      {files.length >= 2 && (
        <button
          onClick={merge}
          disabled={merging}
          className="mt-4 w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press disabled:opacity-50"
        >
          {merging ? "Merging..." : `Merge ${files.length} PDFs into one`}
        </button>
      )}
    </ToolLayout>
  );
}
