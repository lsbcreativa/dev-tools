"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

interface SimulationType {
  id: string;
  label: string;
  description: string;
  filter: string;
}

const SIMULATIONS: SimulationType[] = [
  {
    id: "original",
    label: "Original",
    description: "Normal color vision",
    filter: "none",
  },
  {
    id: "protanopia",
    label: "Protanopia",
    description: "Red-blind — cannot perceive red",
    filter: "url(#protanopia)",
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    description: "Green-blind — cannot perceive green",
    filter: "url(#deuteranopia)",
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    description: "Blue-blind — cannot perceive blue",
    filter: "url(#tritanopia)",
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia",
    description: "Full colorblind — sees only grayscale",
    filter: "url(#achromatopsia)",
  },
  {
    id: "anomalous",
    label: "Anomalous Trichromacy",
    description: "Reduced color sensitivity",
    filter: "url(#anomalous)",
  },
];

const faqs = [
  {
    question: "What is color blindness?",
    answer:
      "Color blindness (color vision deficiency) is a condition where a person has reduced ability to distinguish between certain colors. It is usually inherited and affects the cone cells in the retina. The most common forms affect the ability to distinguish red from green.",
  },
  {
    question: "What are the types of color blindness?",
    answer:
      "The main types are: Protanopia (red-blind, cannot see red light), Deuteranopia (green-blind, most common form), Tritanopia (blue-blind, rare), and Achromatopsia (complete color blindness, very rare). There are also partial forms called anomalous trichromacy where colors are perceived but with reduced sensitivity.",
  },
  {
    question: "How many people are color blind?",
    answer:
      "About 8% of men and 0.5% of women of Northern European descent have some form of color vision deficiency. Globally, approximately 300 million people are color blind. Red-green color blindness (protanopia and deuteranopia combined) is by far the most common form.",
  },
  {
    question: "How should I design for color blind users?",
    answer:
      "Never rely on color alone to convey information — always use shapes, patterns, labels, or icons alongside color. Ensure sufficient contrast between UI elements. Use color-blind-safe palettes (tools like ColorBrewer help). Test your designs with a simulator like this one. Avoid red/green combinations as primary indicators.",
  },
];

export default function ColorBlindnessSimulator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCorsError(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleLoadUrl = () => {
    if (!urlInput.trim()) return;
    setCorsError(false);
    setImageSrc(urlInput.trim());
  };

  const handleImageError = () => {
    setCorsError(true);
  };

  return (
    <ToolLayout
      title="Color Blindness Simulator"
      description="Simulate how your designs look to users with color blindness. Upload an image and preview all major types side by side."
      slug="color-blindness"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "Types of Color Blindness and How They Affect Vision",
              content:
                "Protanopia affects about 1% of males and causes an inability to perceive red light. Deuteranopia is the most common form, affecting about 1% of males, and causes an inability to perceive green light. Together these red-green deficiencies affect roughly 8% of males. Tritanopia is rare (0.01% of people) and affects blue-yellow perception. Achromatopsia is extremely rare and results in complete absence of color vision. Anomalous trichromacy is the most common form overall and involves reduced sensitivity to one or more color channels.",
            },
            {
              title: "Designing Accessible Interfaces for Color Blind Users",
              content:
                "To create accessible designs: (1) Never use color as the only visual cue — add icons, patterns, or text labels. (2) Ensure a contrast ratio of at least 4.5:1 for text. (3) Use color-blind-safe palettes — avoid pure red/green combinations. (4) Test with multiple simulation types, not just one. (5) Use underlines for links rather than relying on color alone. (6) In charts and graphs, use patterns or direct labels in addition to color coding. Following WCAG 2.1 guidelines covers many color accessibility requirements.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Hidden SVG filter definitions */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <filter id="protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="achromatopsia">
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="anomalous">
            <feColorMatrix
              type="matrix"
              values="0.618 0.320 0.062 0 0  0.163 0.775 0.062 0 0  0.163 0.320 0.516 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Upload / URL area */}
      {!imageSrc ? (
        <div className="space-y-4">
          {/* Drag & Drop */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 transition-all ${
              isDragging
                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/50"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--muted-foreground)]"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-medium">Drop an image here or click to upload</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                PNG, JPG, GIF, WebP, SVG
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadUrl()}
              placeholder="Or paste an image URL..."
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)] transition-colors"
            />
            <button
              onClick={handleLoadUrl}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press transition-colors"
            >
              Load
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Clear button */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">
              Showing 6 color blindness simulations
            </p>
            <button
              onClick={() => {
                setImageSrc(null);
                setUrlInput("");
                setCorsError(false);
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press transition-colors"
            >
              Load New Image
            </button>
          </div>

          {corsError && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400">
              Could not load image from URL — the server may block cross-origin
              requests (CORS). Try downloading the image and uploading it
              directly.
            </div>
          )}

          {/* 2x3 Grid of simulations */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SIMULATIONS.map((sim) => (
              <div key={sim.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{sim.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {sim.description}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={`${sim.label} simulation`}
                    crossOrigin="anonymous"
                    onError={sim.id === "original" ? handleImageError : undefined}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      filter: sim.filter,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
