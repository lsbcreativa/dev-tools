"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

export default function QrCodeGenerator() {
  const [input, setInput] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const generateQR = useCallback(async () => {
    if (!input.trim()) {
      setError("Please enter some text or a URL.");
      return;
    }
    setError("");
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(input, {
        width: 400,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setQrDataUrl(url);
    } catch {
      setError("Failed to generate QR code. Try shorter input.");
    }
  }, [input]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate QR codes from any text or URL. Download as PNG image."
      slug="qr-code-generator"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Text or URL</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text or URL to generate a QR code..."
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
          rows={3}
        />
      </div>

      <button
        onClick={generateQR}
        className="mt-3 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
      >
        Generate QR Code
      </button>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {qrDataUrl && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="rounded-xl border border-[var(--border)] bg-white p-4">
            <img src={qrDataUrl} alt="QR Code" width={300} height={300} />
          </div>
          <button
            onClick={downloadQR}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Download PNG
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
