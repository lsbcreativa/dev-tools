"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt",
];

function generateSentence(minWords: number, maxWords: number): string {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(6, 14));
  }
  return sentences.join(" ");
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [result, setResult] = useState("");

  const generate = () => {
    if (type === "paragraphs") {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      setResult(paragraphs.join("\n\n"));
    } else if (type === "sentences") {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(6, 14));
      }
      setResult(sentences.join(" "));
    } else {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
      }
      setResult(words.join(" "));
    }
  };

  const faqs = [
    {
      question: "Is Lorem Ipsum real Latin?",
      answer:
        "It's derived from a real Latin text by Cicero ('De Finibus Bonorum et Malorum'), but the modern version has been altered with added, removed, and scrambled words. It's not grammatically correct Latin.",
    },
    {
      question: "When should I not use Lorem Ipsum?",
      answer:
        "Avoid Lorem Ipsum when content length affects design decisions, when testing text processing features, or when stakeholders need to evaluate content flow. In these cases, use real or realistic sample content.",
    },
    {
      question: "How many words are in a standard Lorem Ipsum paragraph?",
      answer:
        "A standard Lorem Ipsum paragraph contains approximately 60-80 words, similar to an average English paragraph. This tool lets you control the exact amount you generate.",
    },
  ];

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs and mockups."
      slug="lorem-ipsum-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Generate Lorem Ipsum Text",
              content:
                "Select the type of placeholder text you need \u2014 paragraphs, sentences, or words \u2014 and specify the quantity. Click Generate to create lorem ipsum text instantly. The generated text follows the traditional Latin-like placeholder format used in typesetting and design since the 1500s. Copy the result with one click.",
            },
            {
              title: "What Is Lorem Ipsum and Why Use It",
              content:
                "Lorem Ipsum is placeholder text used in design, publishing, and web development to fill layouts before final content is ready. It approximates the visual appearance of English text without being readable, preventing reviewers from focusing on content instead of design. The standard Lorem Ipsum passage comes from a work by Cicero written in 45 BC, though the modern version has been modified and scrambled over centuries.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Amount</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            max={100}
            className="w-24 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <button
          onClick={generate}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] btn-press"
        >
          Generate
        </button>
      </div>

      {result && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Generated Text</span>
            <CopyButton text={result} />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {result}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
