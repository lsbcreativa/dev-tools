"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

export default function OgPreview() {
  const [title, setTitle] = useState("My Awesome Website");
  const [description, setDescription] = useState(
    "A brief description of the page content that will appear in social media previews."
  );
  const [imageUrl, setImageUrl] = useState(
    "https://placehold.co/1200x630/6366f1/ffffff?text=OG+Image"
  );
  const [siteName, setSiteName] = useState("example.com");
  const [url, setUrl] = useState("https://example.com/page");

  const metaTags = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${url}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />`;

  const truncate = (text: string, maxLen: number) =>
    text.length > maxLen ? text.substring(0, maxLen) + "..." : text;

  const getDomain = (rawUrl: string) => {
    try {
      return new URL(rawUrl).hostname;
    } catch {
      return rawUrl;
    }
  };

  return (
    <ToolLayout
      title="Open Graph Preview"
      description="Preview and generate Open Graph meta tags for Twitter, Facebook, and LinkedIn social sharing."
      slug="og-preview"
    >
      {/* Form */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page title"
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Page description"
            rows={3}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm resize-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="My Website"
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Preview cards */}
      <div className="mb-6 space-y-6">
        {/* Twitter Large Card */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">
            Twitter (Large Summary Card)
          </h3>
          <div
            className="overflow-hidden rounded-2xl border border-[var(--border)]"
            style={{ maxWidth: 520 }}
          >
            {imageUrl && (
              <div
                className="w-full bg-[var(--muted)]"
                style={{ aspectRatio: "2/1" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="OG Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="p-3" style={{ background: "var(--muted)" }}>
              <p className="text-xs text-[var(--muted-foreground)]">
                {getDomain(url)}
              </p>
              <p className="text-sm font-semibold leading-tight mt-0.5">
                {truncate(title, 70)}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-snug">
                {truncate(description, 200)}
              </p>
            </div>
          </div>
        </div>

        {/* Facebook */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">
            Facebook (Link Preview)
          </h3>
          <div
            className="overflow-hidden rounded-lg border border-[var(--border)]"
            style={{ maxWidth: 520 }}
          >
            {imageUrl && (
              <div
                className="w-full bg-[var(--muted)]"
                style={{ aspectRatio: "1.91/1" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="OG Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div
              className="p-3 border-t border-[var(--border)]"
              style={{ background: "var(--muted)" }}
            >
              <p
                className="text-xs uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                {getDomain(url)}
              </p>
              <p className="text-base font-semibold leading-tight mt-1">
                {truncate(title, 65)}
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mt-0.5 leading-snug">
                {truncate(description, 155)}
              </p>
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">
            LinkedIn (Link Preview)
          </h3>
          <div
            className="overflow-hidden rounded-lg border border-[var(--border)]"
            style={{ maxWidth: 520 }}
          >
            {imageUrl && (
              <div
                className="w-full bg-[var(--muted)]"
                style={{ aspectRatio: "1.91/1" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="OG Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div
              className="p-3 border-t border-[var(--border)]"
              style={{ background: "var(--muted)" }}
            >
              <p className="text-sm font-semibold leading-tight">
                {truncate(title, 70)}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-snug">
                {getDomain(url)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Tags Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">HTML Meta Tags</span>
          <CopyButton text={metaTags} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          {metaTags}
        </pre>
      </div>
    </ToolLayout>
  );
}
