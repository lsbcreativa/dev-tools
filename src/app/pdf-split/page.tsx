"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

export default function PdfSplit() {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState("");
  const [splitting, setSplitting] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = useCallback(async (file: File) => {
    setError("");
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    try {
      const data = await file.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
      setPdfData(data);
      setFileName(file.name);
      setPageCount(pdf.getPageCount());
      setRangeInput(`1-${pdf.getPageCount()}`);
    } catch {
      setError("Failed to read the PDF file.");
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadPdf(file);
  };

  const parseRanges = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes("-")) {
        const [a, b] = part.split("-").map(Number);
        if (!isNaN(a) && !isNaN(b)) {
          for (let i = Math.max(1, a); i <= Math.min(max, b); i++) pages.add(i);
        }
      } else {
        const n = Number(part);
        if (!isNaN(n) && n >= 1 && n <= max) pages.add(n);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const split = async () => {
    if (!pdfData) return;
    setSplitting(true);
    setError("");
    try {
      const pages = parseRanges(rangeInput, pageCount);
      if (pages.length === 0) {
        setError("No valid pages selected.");
        setSplitting(false);
        return;
      }
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(pdfData, { ignoreEncryption: true });
      const dest = await PDFDocument.create();
      const copied = await dest.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((page) => dest.addPage(page));
      const bytes = await dest.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(/\.pdf$/i, "") + `-pages-${rangeInput.replace(/\s/g, "")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to split PDF.");
    } finally {
      setSplitting(false);
    }
  };

  const faqs = [
    {
      question: "Can I extract non-consecutive pages?",
      answer: "Yes. Specify multiple ranges and individual pages separated by commas: 1-3, 7, 12-15. This extracts pages 1, 2, 3, 7, 12, 13, 14, and 15 into a new PDF.",
    },
    {
      question: "Does splitting affect PDF quality?",
      answer: "No. Pages are extracted without re-encoding. Text, images, and formatting remain identical to the original document.",
    },
    {
      question: "Can I split password-protected PDFs?",
      answer: "This tool works with unprotected PDFs. Password-protected files need to be unlocked first before their pages can be extracted.",
    },
  ];

  return (
    <ToolLayout
      title="PDF Split"
      description="Extract specific pages or page ranges from a PDF file. No limits, no signup."
      slug="pdf-split"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Split PDF Files Online",
              content: "Upload a PDF file and specify which pages to extract. Enter page ranges (e.g., 1-5, 8, 12-15) to create a new PDF containing only the selected pages. The extracted PDF maintains the original quality and formatting. All processing happens in your browser.",
            },
            {
              title: "PDF Splitting Use Cases",
              content: "Split PDFs to extract specific chapters from e-books, separate invoices from a combined document, pull specific pages from reports for sharing, remove cover pages or appendices, and create handout-friendly versions of presentations. This client-side tool handles all these scenarios without uploading your documents to any server.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {!pdfData ? (
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
            onChange={(e) => e.target.files?.[0] && loadPdf(e.target.files[0])}
            className="hidden"
          />
          <p className="text-sm font-medium">Click or drag & drop a PDF file</p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Select the file you want to split</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3">
            <div>
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{pageCount} pages</p>
            </div>
            <button
              onClick={() => { setPdfData(null); setFileName(""); setPageCount(0); }}
              className="text-xs text-[var(--destructive)] hover:underline"
            >
              Change file
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Pages to extract</label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-10"
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono"
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Use commas to separate pages and hyphens for ranges. E.g. 1-3, 5, 7-10
            </p>
          </div>

          <button
            onClick={split}
            disabled={splitting || !rangeInput.trim()}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press disabled:opacity-50"
          >
            {splitting ? "Splitting..." : "Extract pages & download"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}
    </ToolLayout>
  );
}
