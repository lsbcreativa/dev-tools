"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

export default function MetaTagGeneratorTool() {
  // Basic fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [robots, setRobots] = useState("index, follow");

  // Open Graph
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogUrl, setOgUrl] = useState("");
  const [ogType, setOgType] = useState("website");

  // Twitter
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [twitterImage, setTwitterImage] = useState("");

  const esc = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const output = useMemo(() => {
    const lines: string[] = [];
    lines.push('<meta charset="UTF-8">');
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');

    if (title) lines.push(`<title>${esc(title)}</title>`);
    if (description) lines.push(`<meta name="description" content="${esc(description)}">`);
    if (keywords) lines.push(`<meta name="keywords" content="${esc(keywords)}">`);
    if (author) lines.push(`<meta name="author" content="${esc(author)}">`);
    if (robots) lines.push(`<meta name="robots" content="${esc(robots)}">`);

    // Open Graph
    const finalOgTitle = ogTitle || title;
    const finalOgDesc = ogDescription || description;
    if (finalOgTitle || finalOgDesc || ogImage || ogUrl || ogType) {
      lines.push("");
      lines.push("<!-- Open Graph -->");
      if (finalOgTitle) lines.push(`<meta property="og:title" content="${esc(finalOgTitle)}">`);
      if (finalOgDesc) lines.push(`<meta property="og:description" content="${esc(finalOgDesc)}">`);
      if (ogImage) lines.push(`<meta property="og:image" content="${esc(ogImage)}">`);
      if (ogUrl) lines.push(`<meta property="og:url" content="${esc(ogUrl)}">`);
      if (ogType) lines.push(`<meta property="og:type" content="${esc(ogType)}">`);
    }

    // Twitter
    const finalTwTitle = twitterTitle || title;
    const finalTwDesc = twitterDescription || description;
    const finalTwImage = twitterImage || ogImage;
    if (twitterCard || finalTwTitle || finalTwDesc || finalTwImage) {
      lines.push("");
      lines.push("<!-- Twitter Card -->");
      if (twitterCard) lines.push(`<meta name="twitter:card" content="${esc(twitterCard)}">`);
      if (finalTwTitle) lines.push(`<meta name="twitter:title" content="${esc(finalTwTitle)}">`);
      if (finalTwDesc) lines.push(`<meta name="twitter:description" content="${esc(finalTwDesc)}">`);
      if (finalTwImage) lines.push(`<meta name="twitter:image" content="${esc(finalTwImage)}">`);
    }

    return lines.join("\n");
  }, [title, description, keywords, author, robots, ogTitle, ogDescription, ogImage, ogUrl, ogType, twitterCard, twitterTitle, twitterDescription, twitterImage]);

  const previewTitle = title || "Page Title";
  const previewUrl = ogUrl || "https://example.com";
  const previewDesc = description || "Page description will appear here. Add a description to see a preview.";

  const faqs = [
    {
      question: "What is the ideal length for a meta title?",
      answer: "Keep meta titles between 50-60 characters. Google truncates titles longer than about 60 characters in search results. Include your primary keyword near the beginning for better SEO.",
    },
    {
      question: "Do meta tags directly affect SEO rankings?",
      answer: "The title tag directly affects rankings. The meta description doesn't directly impact rankings but affects click-through rates. Open Graph and Twitter Card tags don't affect SEO but improve social media engagement.",
    },
    {
      question: "What size should the Open Graph image be?",
      answer: "The recommended size is 1200x630 pixels for Open Graph images. This works well across Facebook, LinkedIn, Twitter, and WhatsApp. Use PNG or JPG format and keep file size under 1MB.",
    },
  ];

  return (
    <ToolLayout
      title="Meta Tag Generator"
      description="Generate HTML meta tags for SEO, Open Graph, and Twitter Cards with a live preview."
      slug="meta-tag-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Generate Meta Tags for SEO",
              content: "Fill in your page title, description, URL, and image to generate complete HTML meta tags including standard SEO tags, Open Graph tags for Facebook/LinkedIn, and Twitter Card tags. Copy the generated code and paste it into your HTML head section. The live preview shows how your page will appear in Google search results and social media shares.",
            },
            {
              title: "Essential Meta Tags for Every Web Page",
              content: "Meta tags tell search engines and social platforms about your page content. The title tag (50-60 characters) appears as the clickable headline in search results. The meta description (150-160 characters) provides the summary snippet. Open Graph tags (og:title, og:description, og:image) control how your page appears when shared on Facebook, LinkedIn, and WhatsApp. Twitter Cards (twitter:card, twitter:title) customize the appearance on Twitter/X.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Basic Meta Tags */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Basic Meta Tags</h2>

        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Website"
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
          />
          {title && (
            <p className={`mt-1 text-xs ${title.length > 60 ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"}`}>
              {title.length}/60 characters {title.length > 60 ? "(recommended max 60)" : ""}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of your page..."
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={3}
          />
          {description && (
            <p className={`mt-1 text-xs ${description.length > 160 ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"}`}>
              {description.length}/160 characters {description.length > 160 ? "(recommended max 160)" : ""}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Keywords</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Robots</label>
            <input
              type="text"
              value={robots}
              onChange={(e) => setRobots(e.target.value)}
              placeholder="index, follow"
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className="mt-6 space-y-3">
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Open Graph</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              OG Title <span className="text-xs text-[var(--muted-foreground)]">(defaults to title)</span>
            </label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              placeholder={title || "Page title"}
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">OG Type</label>
            <select
              value={ogType}
              onChange={(e) => setOgType(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm bg-transparent"
            >
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            OG Description <span className="text-xs text-[var(--muted-foreground)]">(defaults to description)</span>
          </label>
          <textarea
            value={ogDescription}
            onChange={(e) => setOgDescription(e.target.value)}
            placeholder={description || "Page description"}
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={2}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">OG Image URL</label>
            <input
              type="url"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">OG URL</label>
            <input
              type="url"
              value={ogUrl}
              onChange={(e) => setOgUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Twitter Card */}
      <div className="mt-6 space-y-3">
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Twitter Card</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Card Type</label>
            <select
              value={twitterCard}
              onChange={(e) => setTwitterCard(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm bg-transparent"
            >
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Twitter Image <span className="text-xs text-[var(--muted-foreground)]">(defaults to OG image)</span>
            </label>
            <input
              type="url"
              value={twitterImage}
              onChange={(e) => setTwitterImage(e.target.value)}
              placeholder={ogImage || "https://example.com/image.png"}
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Twitter Title <span className="text-xs text-[var(--muted-foreground)]">(defaults to title)</span>
            </label>
            <input
              type="text"
              value={twitterTitle}
              onChange={(e) => setTwitterTitle(e.target.value)}
              placeholder={title || "Page title"}
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Twitter Description <span className="text-xs text-[var(--muted-foreground)]">(defaults to description)</span>
            </label>
            <input
              type="text"
              value={twitterDescription}
              onChange={(e) => setTwitterDescription(e.target.value)}
              placeholder={description || "Page description"}
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Google Search Preview */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Google Search Preview</h2>
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <p className="text-sm text-[#1a0dab] font-medium leading-tight truncate">
            {previewTitle}
          </p>
          <p className="text-xs text-[#006621] mt-0.5 truncate">
            {previewUrl}
          </p>
          <p className="text-xs text-[#545454] mt-0.5 line-clamp-2 leading-relaxed">
            {previewDesc}
          </p>
        </div>
      </div>

      {/* Generated Output */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Generated Meta Tags</span>
          <CopyButton text={output} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </ToolLayout>
  );
}
