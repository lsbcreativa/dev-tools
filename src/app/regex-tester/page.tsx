"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

const CHEATSHEET = [
  { pattern: ".", desc: "Any character" },
  { pattern: "\\d", desc: "Digit (0-9)" },
  { pattern: "\\w", desc: "Word char (a-z, 0-9, _)" },
  { pattern: "\\s", desc: "Whitespace" },
  { pattern: "^", desc: "Start of string" },
  { pattern: "$", desc: "End of string" },
  { pattern: "*", desc: "0 or more" },
  { pattern: "+", desc: "1 or more" },
  { pattern: "?", desc: "0 or 1" },
  { pattern: "{n,m}", desc: "Between n and m" },
  { pattern: "[abc]", desc: "Character set" },
  { pattern: "(group)", desc: "Capture group" },
  { pattern: "a|b", desc: "Alternation (or)" },
  { pattern: "(?:...)", desc: "Non-capturing group" },
  { pattern: "(?=...)", desc: "Positive lookahead" },
  { pattern: "\\b", desc: "Word boundary" },
];

const EXAMPLES = [
  { label: "Email", pattern: "[\\w.-]+@[\\w.-]+\\.\\w+", test: "Contact us at hello@example.com or support@test.org" },
  { label: "URL", pattern: "https?://[\\w.-]+(?:/[\\w.-]*)*", test: "Visit https://example.com/page or http://test.org" },
  { label: "Phone", pattern: "\\+?\\d{1,3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}", test: "Call +1-555-1234 or 555.5678" },
  { label: "IP Address", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", test: "Server at 192.168.1.1 and 10.0.0.255" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  const result = useMemo(() => {
    if (!pattern || !testString) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: string[] }[] = [];
      let m: RegExpExecArray | null;

      if (flags.includes("g")) {
        while ((m = regex.exec(testString)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m[0].length === 0) regex.lastIndex++;
        }
      } else {
        m = regex.exec(testString);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }

      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    if (!result || result.error || result.matches.length === 0) return null;
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    for (const m of result.matches) {
      if (m.index > lastIndex) parts.push({ text: testString.slice(lastIndex, m.index), highlight: false });
      parts.push({ text: m.match, highlight: true });
      lastIndex = m.index + m.match.length;
    }
    if (lastIndex < testString.length) parts.push({ text: testString.slice(lastIndex), highlight: false });
    return parts;
  }, [result, testString]);

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setPattern(ex.pattern);
    setTestString(ex.test);
    setFlags("g");
  };

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test regular expressions in real-time with match highlighting and capture groups."
      slug="regex-tester"
      faqs={[
        { question: "How do I test a regular expression online?", answer: "Enter your regex pattern in the Pattern field, add flags if needed (g for global, i for case-insensitive, m for multiline), then type or paste your test string. Matches are highlighted in real time with captured groups shown separately." },
        { question: "What regex flags are available?", answer: "The most common flags are: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line starts/ends), s (dotAll — dot matches newlines), and u (unicode). You can combine multiple flags." },
        { question: "Why is my regex not matching?", answer: "Common issues include: forgetting to escape special characters (use \\. instead of .), not using the global flag when expecting multiple matches, and anchors (^ $) not matching in multiline text without the m flag." }
      ]}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Test Regular Expressions Online", content: "Enter your regex pattern and test string to see matches highlighted in real time. The tool shows each match with its position, captured groups, and the full match text. Supports all JavaScript regex features including lookahead, lookbehind, named groups, and Unicode properties." },
            { title: "Regular Expression Quick Reference", content: "Common patterns: \\d matches digits, \\w matches word characters, \\s matches whitespace, . matches any character, * means zero or more, + means one or more, ? means optional, {n,m} matches between n and m times. Use parentheses () for capture groups and | for alternation." }
          ]}
          faqs={[
            { question: "How do I test a regular expression online?", answer: "Enter your regex pattern in the Pattern field, add flags if needed (g for global, i for case-insensitive, m for multiline), then type or paste your test string. Matches are highlighted in real time with captured groups shown separately." },
            { question: "What regex flags are available?", answer: "The most common flags are: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line starts/ends), s (dotAll — dot matches newlines), and u (unicode). You can combine multiple flags." },
            { question: "Why is my regex not matching?", answer: "Common issues include: forgetting to escape special characters (use \\. instead of .), not using the global flag when expecting multiple matches, and anchors (^ $) not matching in multiline text without the m flag." }
          ]}
        />
      }
    >
      {/* Quick examples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-xs text-[var(--muted-foreground)] py-1">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => loadExample(ex)}
            className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-2.5 py-1 text-xs font-medium transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] btn-press"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-1 block text-sm font-medium">Pattern</label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. \b\w+@\w+\.\w+\b"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Flags</label>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g"
            className="w-20 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-sm font-medium">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={5}
        />
      </div>

      {result?.error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {result.error}
        </div>
      )}

      {highlightedText && (
        <div className="mt-3">
          <h3 className="mb-2 text-sm font-medium">
            Highlighted Matches ({result!.matches.length} found)
          </h3>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono whitespace-pre-wrap">
            {highlightedText.map((part, i) =>
              part.highlight ? (
                <mark key={i} className="rounded bg-yellow-400/40 px-0.5">{part.text}</mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {result && !result.error && result.matches.length > 0 && (
        <div className="mt-3">
          <h3 className="mb-2 text-sm font-medium">Match Details</h3>
          <div className="space-y-1.5">
            {result.matches.map((m, i) => (
              <div key={i} className="flex gap-3 rounded border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-mono">
                <span className="text-[var(--muted-foreground)]">#{i + 1}</span>
                <span className="font-medium">&quot;{m.match}&quot;</span>
                <span className="text-[var(--muted-foreground)]">index: {m.index}</span>
                {m.groups.length > 0 && (
                  <span className="text-[var(--muted-foreground)]">groups: [{m.groups.map((g) => `"${g}"`).join(", ")}]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cheatsheet */}
      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <h3 className="mb-3 text-sm font-semibold">Regex Cheatsheet</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
          {CHEATSHEET.map((item) => (
            <div key={item.pattern} className="flex items-baseline gap-2 py-1">
              <code className="text-xs font-bold text-[var(--primary)] min-w-[4rem]">{item.pattern}</code>
              <span className="text-xs text-[var(--muted-foreground)]">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
