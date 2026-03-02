"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

interface Preset {
  label: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { label: "Full HD (1920x1080)", width: 1920, height: 1080 },
  { label: "OG Image (1200x630)", width: 1200, height: 630 },
  { label: "800x600", width: 800, height: 600 },
  { label: "400x400", width: 400, height: 400 },
  { label: "Thumbnail (150x150)", width: 150, height: 150 },
];

export default function PlaceholderImageGenerator() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#666666");
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const displayText = text || `${width}\u00D7${height}`;
  const autoFontSize = fontSize > 0 ? fontSize : Math.max(12, Math.min(width, height) / 8);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw text
    const computedText = text || `${width}\u00D7${height}`;
    const computedFontSize = fontSize > 0 ? fontSize : Math.max(12, Math.min(width, height) / 8);

    ctx.fillStyle = textColor;
    ctx.font = `${computedFontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(computedText, width / 2, height / 2);
  }, [width, height, bgColor, textColor, text, fontSize]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `placeholder-${width}x${height}.png`;
    link.href = dataURL;
    link.click();
  };

  const applyPreset = (preset: Preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const faqs = [
    { question: "What image formats are supported?", answer: "This tool generates PNG images. PNG provides lossless quality and transparency support, making it ideal for placeholder images with text and solid colors." },
    { question: "Can I use custom colors?", answer: "Yes. Set any background and text color using the color pickers. Choose colors that match your design system or use high-contrast combinations for visibility during development." },
    { question: "What is the maximum image size?", answer: "The tool supports images up to 4000x4000 pixels. For most development purposes, common sizes like 300x200, 800x600, or 1920x1080 are sufficient." },
  ];

  return (
    <ToolLayout
      title="Placeholder Image Generator"
      description="Generate placeholder images with custom dimensions, colors, and text. Download as PNG."
      slug="placeholder-image"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Generate Placeholder Images", content: "Set the width, height, background color, text color, and optional text to generate a placeholder image instantly. Download the result as a PNG file. Placeholder images are useful for wireframes, mockups, and development when final images are not yet available." },
            { title: "Using Placeholder Images in Web Development", content: "Placeholder images help maintain layout structure during development. Instead of waiting for design assets, developers can use generated placeholders with exact dimensions to build responsive layouts, test image loading states, and prototype user interfaces. Common sizes include 150x150 for avatars, 1200x630 for social media cards, 800x600 for content images, and 1920x1080 for hero banners." },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Presets */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Width */}
        <div>
          <label className="mb-1 block text-sm font-medium">Width (px)</label>
          <input
            type="number"
            min={1}
            max={4096}
            value={width}
            onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>

        {/* Height */}
        <div>
          <label className="mb-1 block text-sm font-medium">Height (px)</label>
          <input
            type="number"
            min={1}
            max={4096}
            value={height}
            onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="mb-1 block text-sm font-medium">Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-24 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm font-mono"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="mb-1 block text-sm font-medium">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-24 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm font-mono"
            />
          </div>
        </div>

        {/* Custom Text */}
        <div>
          <label className="mb-1 block text-sm font-medium">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`${width}\u00D7${height}`}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Font Size (0 = auto)
          </label>
          <input
            type="number"
            min={0}
            max={500}
            value={fontSize}
            onChange={(e) => setFontSize(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
          <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
            Computed: {Math.round(autoFontSize)}px
          </span>
        </div>
      </div>

      {/* Canvas Preview */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Preview</label>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 overflow-auto">
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: "100%",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
        <div className="mt-1 text-xs text-[var(--muted-foreground)]">
          Actual size: {width} x {height}px &middot; Text: {displayText}
        </div>
      </div>

      {/* Download */}
      <div>
        <button
          onClick={handleDownload}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Download PNG
        </button>
      </div>
    </ToolLayout>
  );
}
