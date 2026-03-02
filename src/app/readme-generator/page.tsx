"use client";

import { useState, useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

const LICENSE_OPTIONS = [
  { value: "MIT", badge: "MIT" },
  { value: "Apache-2.0", badge: "Apache%202.0" },
  { value: "GPL-3.0", badge: "GPL%20v3" },
  { value: "ISC", badge: "ISC" },
];

const PACKAGE_MANAGERS = ["npm", "yarn", "pnpm"] as const;

function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks (``` ... ```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, _lang, code) =>
      `<pre style="background:var(--muted);border:1px solid var(--border);border-radius:8px;padding:12px;overflow-x:auto;font-size:13px;"><code>${code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</code></pre>`
  );

  // Headings
  html = html.replace(
    /^#### (.+)$/gm,
    '<h4 style="font-size:16px;font-weight:600;margin:16px 0 8px;">$1</h4>'
  );
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 style="font-size:18px;font-weight:600;margin:16px 0 8px;">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="font-size:22px;font-weight:600;margin:20px 0 8px;padding-bottom:4px;border-bottom:1px solid var(--border);">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 style="font-size:28px;font-weight:700;margin:0 0 8px;">$1</h1>'
  );

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Images (before links)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width:100%;height:auto;" />'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color:var(--primary);text-decoration:underline;">$1</a>'
  );

  // Unordered list items
  html = html.replace(
    /^- (.+)$/gm,
    '<li style="margin-left:20px;list-style:disc;">$1</li>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr style="border-color:var(--border);margin:16px 0;" />');

  // Paragraphs: wrap loose lines
  html = html
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (
        trimmed === "" ||
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<img") ||
        trimmed.startsWith("<code") ||
        trimmed.startsWith("</")
      ) {
        return line;
      }
      return `<p style="margin:4px 0;line-height:1.6;">${line}</p>`;
    })
    .join("\n");

  return html;
}

export default function ReadmeGenerator() {
  const [projectName, setProjectName] = useState("my-project");
  const [projectDescription, setProjectDescription] = useState(
    "A brief description of what this project does."
  );
  const [license, setLicense] = useState("MIT");
  const [version, setVersion] = useState("1.0.0");
  const [packageManager, setPackageManager] =
    useState<(typeof PACKAGE_MANAGERS)[number]>("npm");
  const [installCommand, setInstallCommand] = useState("my-project");
  const [usageCode, setUsageCode] = useState(
    'import { something } from "my-project";\n\nsomething();'
  );
  const [features, setFeatures] = useState<string[]>([
    "Feature one",
    "Feature two",
    "Feature three",
  ]);
  const [newFeature, setNewFeature] = useState("");
  const [techStack, setTechStack] = useState("React, TypeScript, Node.js");
  const [includeContributing, setIncludeContributing] = useState(true);
  const [authorName, setAuthorName] = useState("");

  const [showPreview, setShowPreview] = useState(false);

  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (trimmed) {
      setFeatures((prev) => [...prev, trimmed]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const licenseOption = LICENSE_OPTIONS.find((l) => l.value === license);

  const installCmd = (() => {
    switch (packageManager) {
      case "npm":
        return `npm install ${installCommand}`;
      case "yarn":
        return `yarn add ${installCommand}`;
      case "pnpm":
        return `pnpm add ${installCommand}`;
    }
  })();

  const markdown = useMemo(() => {
    const lines: string[] = [];

    lines.push(`# ${projectName}`);
    lines.push("");

    // Badges
    const badgeParts: string[] = [];
    if (version) {
      badgeParts.push(
        `![Version](https://img.shields.io/badge/version-${encodeURIComponent(version)}-blue)`
      );
    }
    if (licenseOption) {
      badgeParts.push(
        `![License](https://img.shields.io/badge/license-${licenseOption.badge}-green)`
      );
    }
    if (badgeParts.length > 0) {
      lines.push(badgeParts.join(" "));
      lines.push("");
    }

    lines.push(projectDescription);
    lines.push("");

    // Features
    if (features.length > 0) {
      lines.push("## Features");
      lines.push("");
      features.forEach((f) => lines.push(`- ${f}`));
      lines.push("");
    }

    // Tech Stack
    if (techStack.trim()) {
      lines.push("## Tech Stack");
      lines.push("");
      lines.push(
        techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => `**${t}**`)
          .join(", ")
      );
      lines.push("");
    }

    // Installation
    lines.push("## Installation");
    lines.push("");
    lines.push("```bash");
    lines.push(installCmd);
    lines.push("```");
    lines.push("");

    // Usage
    if (usageCode.trim()) {
      lines.push("## Usage");
      lines.push("");
      lines.push("```js");
      lines.push(usageCode);
      lines.push("```");
      lines.push("");
    }

    // Contributing
    if (includeContributing) {
      lines.push("## Contributing");
      lines.push("");
      lines.push(
        "Contributions are welcome! Please feel free to submit a Pull Request."
      );
      lines.push("");
      lines.push("1. Fork the project");
      lines.push("2. Create your feature branch (`git checkout -b feature/amazing-feature`)");
      lines.push("3. Commit your changes (`git commit -m 'Add amazing feature'`)");
      lines.push("4. Push to the branch (`git push origin feature/amazing-feature`)");
      lines.push("5. Open a Pull Request");
      lines.push("");
    }

    // License
    lines.push("## License");
    lines.push("");
    lines.push(`This project is licensed under the ${license} License.`);
    lines.push("");

    // Author
    if (authorName.trim()) {
      lines.push("---");
      lines.push("");
      lines.push(`Made by **${authorName.trim()}**`);
      lines.push("");
    }

    return lines.join("\n");
  }, [
    projectName,
    projectDescription,
    license,
    version,
    licenseOption,
    installCmd,
    usageCode,
    features,
    techStack,
    includeContributing,
    authorName,
  ]);

  const renderedHtml = useMemo(() => DOMPurify.sanitize(markdownToHtml(markdown)), [markdown]);

  return (
    <ToolLayout
      title="GitHub README Generator"
      description="Generate a professional README.md for your GitHub project with badges, installation, usage, and more."
      slug="readme-generator"
    >
      {/* Form */}
      <div className="space-y-5">
        {/* Project basics */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Author</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm resize-none"
          />
        </div>

        {/* Badges */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">License</label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            >
              {LICENSE_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>

        {/* Installation */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Package Manager
            </label>
            <select
              value={packageManager}
              onChange={(e) =>
                setPackageManager(
                  e.target.value as (typeof PACKAGE_MANAGERS)[number]
                )
              }
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            >
              {PACKAGE_MANAGERS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Package Name
            </label>
            <input
              type="text"
              value={installCommand}
              onChange={(e) => setInstallCommand(e.target.value)}
              placeholder="my-package"
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>

        {/* Usage */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Usage Code Example
          </label>
          <textarea
            value={usageCode}
            onChange={(e) => setUsageCode(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono resize-none"
          />
        </div>

        {/* Features */}
        <div>
          <label className="mb-1 block text-sm font-medium">Features</label>
          <div className="space-y-2 mb-2">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 px-3 py-1.5"
              >
                <span className="flex-1 text-sm">{f}</span>
                <button
                  onClick={() => removeFeature(i)}
                  className="text-xs text-[var(--destructive)] hover:underline font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="Add a feature..."
              className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            />
            <button
              onClick={addFeature}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              Add
            </button>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="React, TypeScript, Node.js"
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
        </div>

        {/* Contributing checkbox */}
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={includeContributing}
            onChange={(e) => setIncludeContributing(e.target.checked)}
            className="rounded"
          />
          Include Contributing section
        </label>
      </div>

      {/* Toggle between raw / preview */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Output</span>
            <button
              onClick={() => setShowPreview(false)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors btn-press ${
                !showPreview
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Raw Markdown
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors btn-press ${
                showPreview
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Preview
            </button>
          </div>
          <CopyButton text={markdown} />
        </div>

        {showPreview ? (
          <div
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-6 text-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        ) : (
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {markdown}
          </pre>
        )}
      </div>
    </ToolLayout>
  );
}
