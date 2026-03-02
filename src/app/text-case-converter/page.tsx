"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function toSnakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
}

function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toPascalCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase());
}

function toSentenceCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

const conversions = [
  { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { label: "lowercase", fn: (s: string) => s.toLowerCase() },
  { label: "Title Case", fn: toTitleCase },
  { label: "Sentence case", fn: toSentenceCase },
  { label: "camelCase", fn: toCamelCase },
  { label: "PascalCase", fn: toPascalCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
];

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const applyConversion = (fn: (s: string) => string) => {
    setResult(fn(text));
  };

  const faqs = [
    {
      question: "What is the difference between camelCase and PascalCase?",
      answer:
        "camelCase starts with a lowercase letter (myVariable), while PascalCase starts with an uppercase letter (MyComponent). In JavaScript, camelCase is used for variables and functions, PascalCase for React components and class names.",
    },
    {
      question: "When should I use snake_case vs kebab-case?",
      answer:
        "snake_case is the standard in Python, Ruby, and database column names. kebab-case is used in CSS class names, URL slugs, and HTML attributes. Neither can be used as JavaScript variable names directly.",
    },
    {
      question: "Does Title Case capitalize every word?",
      answer:
        "Title Case capitalizes the first letter of each word. Some style guides (AP, Chicago) exclude small words like 'a', 'the', 'in', 'of' from capitalization, but this tool capitalizes all words for simplicity.",
    },
  ];

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and more."
      slug="text-case-converter"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert Text Case Online",
              content:
                "Paste your text and click any conversion button to transform it instantly. Supported conversions include UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and dot.case. Each conversion follows standard naming conventions used in programming and writing.",
            },
            {
              title: "Text Case Conventions in Programming",
              content:
                "Different programming languages and contexts use different naming conventions. JavaScript uses camelCase for variables and PascalCase for classes. Python prefers snake_case for variables and functions. CSS uses kebab-case for class names. Environment variables use CONSTANT_CASE. Understanding and applying the correct case convention improves code readability and follows community standards.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        className="w-full rounded-lg border border-[var(--border)] p-4 text-sm"
        rows={5}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {conversions.map((c) => (
          <button
            key={c.label}
            onClick={() => applyConversion(c.fn)}
            className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm font-medium transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] btn-press"
          >
            {c.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Result</span>
            <CopyButton text={result} />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
