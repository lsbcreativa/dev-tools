"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

export default function WordCounter() {
  const [text, setText] = useState("");

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentences =
    text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs =
    text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const faqs = [
    {
      question: "Does this tool count words in all languages?",
      answer:
        "Yes. The word counter works with English, Spanish, French, German, and most Latin-script languages. For CJK languages (Chinese, Japanese, Korean), character count is more relevant than word count since these languages don't use spaces between words.",
    },
    {
      question: "How is reading time calculated?",
      answer:
        "Reading time is estimated at 200 words per minute, which is the average adult reading speed. Technical or academic content may take longer. The estimate gives you a quick idea of how long your content takes to read.",
    },
    {
      question: "Are spaces and line breaks counted as characters?",
      answer:
        "The tool shows both counts: characters with spaces and characters without spaces. Line breaks and tabs are counted as characters in the 'with spaces' count but excluded from the 'without spaces' count.",
    },
  ];

  return (
    <ToolLayout
      title="Word & Character Counter"
      description="Count words, characters, sentences, paragraphs and estimate reading time."
      slug="word-counter"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Count Words and Characters Online",
              content:
                "Paste or type your text in the input field to instantly see word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time. This tool processes text entirely in your browser \u2014 nothing is sent to any server. It works with any language and handles special characters, punctuation, and whitespace intelligently.",
            },
            {
              title: "Why Word Count Matters for Writers and SEO",
              content:
                "Word count is critical for content creation, academic writing, and SEO optimization. Blog posts typically perform best at 1,500-2,500 words for SEO, while meta descriptions should stay under 160 characters. Academic papers have strict word limits. Social media platforms impose character limits: Twitter/X (280 chars), LinkedIn posts (3,000 chars), Instagram captions (2,200 chars). This tool helps you stay within these constraints.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        className="w-full rounded-lg border border-[var(--border)] p-4 text-sm leading-relaxed"
        rows={10}
      />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Words", value: words },
          { label: "Characters", value: chars },
          { label: "No Spaces", value: charsNoSpaces },
          { label: "Sentences", value: sentences },
          { label: "Paragraphs", value: paragraphs },
          { label: "Reading Time", value: `${readingTime} min` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-center"
          >
            <div className="text-2xl font-bold text-[var(--primary)]">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
