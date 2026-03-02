"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium transition-all hover:bg-[var(--muted)] btn-press ${
        copied ? "border-[var(--success)] text-[var(--success)]" : ""
      } ${className}`}
    >
      {copied ? (
        <>
          <Check size={14} />
          {label && "Copied!"}
        </>
      ) : (
        <>
          <Copy size={14} />
          {label}
        </>
      )}
    </button>
  );
}
