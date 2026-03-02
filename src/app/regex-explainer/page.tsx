"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

interface Token {
  raw: string;
  explanation: string;
}

function tokenizeRegex(pattern: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < pattern.length) {
    const ch = pattern[i];

    // Escaped characters
    if (ch === "\\") {
      if (i + 1 < pattern.length) {
        const next = pattern[i + 1];
        const map: Record<string, string> = {
          d: "Any digit (0-9)",
          D: "Any non-digit",
          w: "Any word character (letter, digit, or underscore)",
          W: "Any non-word character",
          s: "Any whitespace character",
          S: "Any non-whitespace character",
          b: "Word boundary",
          B: "Non-word boundary",
          n: 'Newline character ("\\n")',
          t: 'Tab character ("\\t")',
          r: 'Carriage return ("\\r")',
        };
        if (map[next]) {
          tokens.push({ raw: `\\${next}`, explanation: map[next] });
        } else {
          tokens.push({
            raw: `\\${next}`,
            explanation: `Literal "${next}"`,
          });
        }
        i += 2;
        continue;
      }
    }

    // Anchors
    if (ch === "^") {
      tokens.push({ raw: "^", explanation: "Start of string" });
      i++;
      continue;
    }
    if (ch === "$") {
      tokens.push({ raw: "$", explanation: "End of string" });
      i++;
      continue;
    }

    // Dot
    if (ch === ".") {
      tokens.push({
        raw: ".",
        explanation: "Any character (except newline)",
      });
      i++;
      continue;
    }

    // Alternation
    if (ch === "|") {
      tokens.push({ raw: "|", explanation: "Or" });
      i++;
      continue;
    }

    // Character class
    if (ch === "[") {
      let j = i + 1;
      let negated = false;
      if (j < pattern.length && pattern[j] === "^") {
        negated = true;
        j++;
      }
      // Find closing bracket
      while (j < pattern.length && pattern[j] !== "]") {
        if (pattern[j] === "\\" && j + 1 < pattern.length) {
          j += 2;
        } else {
          j++;
        }
      }
      const classContent = pattern.substring(i + 1 + (negated ? 1 : 0), j);
      const raw = pattern.substring(i, j + 1);

      // Common named classes
      const knownClasses: Record<string, string> = {
        "a-z": "Any lowercase letter",
        "A-Z": "Any uppercase letter",
        "0-9": "Any digit",
        "a-zA-Z": "Any letter",
        "a-zA-Z0-9": "Any alphanumeric character",
        "A-Za-z": "Any letter",
        "A-Za-z0-9": "Any alphanumeric character",
      };

      let desc: string;
      if (knownClasses[classContent]) {
        desc = negated
          ? `Not ${knownClasses[classContent].toLowerCase()}`
          : knownClasses[classContent];
      } else if (classContent.includes("-")) {
        desc = negated
          ? `None of the range: ${classContent}`
          : `Character in range: ${classContent}`;
      } else {
        const chars = classContent.split("").join(", ");
        desc = negated ? `None of: ${chars}` : `One of: ${chars}`;
      }

      tokens.push({ raw, explanation: desc });
      i = j + 1;
      continue;
    }

    // Groups
    if (ch === "(") {
      // Look for special group types
      if (pattern.substring(i, i + 3) === "(?:") {
        // Find matching close paren
        let depth = 1;
        let j = i + 3;
        while (j < pattern.length && depth > 0) {
          if (pattern[j] === "(" && pattern[j - 1] !== "\\") depth++;
          if (pattern[j] === ")" && pattern[j - 1] !== "\\") depth--;
          j++;
        }
        const inner = pattern.substring(i + 3, j - 1);
        tokens.push({
          raw: pattern.substring(i, j),
          explanation: `Non-capturing group: ${inner}`,
        });
        i = j;
        continue;
      }
      if (pattern.substring(i, i + 3) === "(?=") {
        let depth = 1;
        let j = i + 3;
        while (j < pattern.length && depth > 0) {
          if (pattern[j] === "(" && pattern[j - 1] !== "\\") depth++;
          if (pattern[j] === ")" && pattern[j - 1] !== "\\") depth--;
          j++;
        }
        const inner = pattern.substring(i + 3, j - 1);
        tokens.push({
          raw: pattern.substring(i, j),
          explanation: `Positive lookahead (followed by): ${inner}`,
        });
        i = j;
        continue;
      }
      if (pattern.substring(i, i + 3) === "(?!") {
        let depth = 1;
        let j = i + 3;
        while (j < pattern.length && depth > 0) {
          if (pattern[j] === "(" && pattern[j - 1] !== "\\") depth++;
          if (pattern[j] === ")" && pattern[j - 1] !== "\\") depth--;
          j++;
        }
        const inner = pattern.substring(i + 3, j - 1);
        tokens.push({
          raw: pattern.substring(i, j),
          explanation: `Negative lookahead (not followed by): ${inner}`,
        });
        i = j;
        continue;
      }
      if (pattern.substring(i, i + 4) === "(?<=") {
        let depth = 1;
        let j = i + 4;
        while (j < pattern.length && depth > 0) {
          if (pattern[j] === "(" && pattern[j - 1] !== "\\") depth++;
          if (pattern[j] === ")" && pattern[j - 1] !== "\\") depth--;
          j++;
        }
        const inner = pattern.substring(i + 4, j - 1);
        tokens.push({
          raw: pattern.substring(i, j),
          explanation: `Positive lookbehind (preceded by): ${inner}`,
        });
        i = j;
        continue;
      }
      if (pattern.substring(i, i + 4) === "(?<!") {
        let depth = 1;
        let j = i + 4;
        while (j < pattern.length && depth > 0) {
          if (pattern[j] === "(" && pattern[j - 1] !== "\\") depth++;
          if (pattern[j] === ")" && pattern[j - 1] !== "\\") depth--;
          j++;
        }
        const inner = pattern.substring(i + 4, j - 1);
        tokens.push({
          raw: pattern.substring(i, j),
          explanation: `Negative lookbehind (not preceded by): ${inner}`,
        });
        i = j;
        continue;
      }

      // Regular capturing group
      let depth = 1;
      let j = i + 1;
      while (j < pattern.length && depth > 0) {
        if (pattern[j] === "(" && pattern[j - 1] !== "\\") depth++;
        if (pattern[j] === ")" && pattern[j - 1] !== "\\") depth--;
        j++;
      }
      const inner = pattern.substring(i + 1, j - 1);
      tokens.push({
        raw: pattern.substring(i, j),
        explanation: `Capturing group: ${inner}`,
      });
      i = j;
      continue;
    }

    // Quantifiers
    if (ch === "+") {
      tokens.push({ raw: "+", explanation: "One or more of the preceding" });
      i++;
      continue;
    }
    if (ch === "*") {
      tokens.push({ raw: "*", explanation: "Zero or more of the preceding" });
      i++;
      continue;
    }
    if (ch === "?") {
      tokens.push({
        raw: "?",
        explanation: "Optional (zero or one) of the preceding",
      });
      i++;
      continue;
    }

    // Curly brace quantifiers
    if (ch === "{") {
      const match = pattern.substring(i).match(/^\{(\d+)(?:,(\d*))?\}/);
      if (match) {
        const raw = match[0];
        const n = match[1];
        const m = match[2];
        let explanation: string;
        if (m === undefined) {
          explanation = `Exactly ${n} times`;
        } else if (m === "") {
          explanation = `${n} or more times`;
        } else {
          explanation = `Between ${n} and ${m} times`;
        }
        tokens.push({ raw, explanation });
        i += raw.length;
        continue;
      }
    }

    // Literal character
    tokens.push({ raw: ch, explanation: `Literal "${ch}"` });
    i++;
  }

  return tokens;
}

function highlightMatches(
  text: string,
  pattern: string
): { text: string; isMatch: boolean }[] {
  if (!pattern.trim()) {
    return [{ text, isMatch: false }];
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, "g");
  } catch {
    return [{ text, isMatch: false }];
  }

  const segments: { text: string; isMatch: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        isMatch: false,
      });
    }
    if (match[0].length > 0) {
      segments.push({ text: match[0], isMatch: true });
    }
    lastIndex = match.index + match[0].length;

    // Prevent infinite loop for zero-length matches
    if (match[0].length === 0) {
      regex.lastIndex++;
    }
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.substring(lastIndex), isMatch: false });
  }

  if (segments.length === 0) {
    return [{ text, isMatch: false }];
  }

  return segments;
}

export default function RegexExplainer() {
  const [pattern, setPattern] = useState("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
  const [testText, setTestText] = useState(
    "user@example.com\ninvalid-email\nhello@world.org\ntest@.com"
  );

  const tokens = useMemo(() => tokenizeRegex(pattern), [pattern]);

  const isValidRegex = useMemo(() => {
    try {
      new RegExp(pattern);
      return true;
    } catch {
      return false;
    }
  }, [pattern]);

  const segments = useMemo(
    () => (isValidRegex ? highlightMatches(testText, pattern) : []),
    [testText, pattern, isValidRegex]
  );

  const matchCount = useMemo(() => {
    if (!isValidRegex || !pattern.trim()) return 0;
    try {
      const matches = testText.match(new RegExp(pattern, "g"));
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [testText, pattern, isValidRegex]);

  const explanationText = tokens
    .map((t, i) => `${i + 1}. ${t.raw}  =>  ${t.explanation}`)
    .join("\n");

  const faqs = [
    {
      question: "What do the common regex symbols mean?",
      answer: ". matches any character, * means zero or more, + means one or more, ? means optional, ^ anchors to start, $ anchors to end, [] defines character classes, () creates groups, and | means OR.",
    },
    {
      question: "Is regex the same in all programming languages?",
      answer: "Core regex syntax is similar across languages, but there are differences in advanced features. JavaScript lacks lookbehind in older versions, Python uses re module with named groups (?P<name>), and PCRE (PHP, Perl) supports recursive patterns. Basic patterns work everywhere.",
    },
    {
      question: "How do I match special characters literally?",
      answer: "Escape special characters with a backslash: \\. matches a literal dot, \\* matches a literal asterisk, \\( matches a literal parenthesis. Inside character classes, most special characters don't need escaping.",
    },
  ];

  return (
    <ToolLayout
      title="Regex Explainer"
      description="Paste a regular expression and get a plain-English explanation of every part. Test it against sample text with match highlighting."
      slug="regex-explainer"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Understand Regular Expressions",
              content: "Paste any regular expression and get a plain-English explanation of what each part does. The tool breaks down the regex into its components — character classes, quantifiers, groups, anchors, lookaheads — and explains each one in simple terms. This is invaluable for understanding complex regex patterns written by others or debugging your own.",
            },
            {
              title: "Common Regular Expression Patterns",
              content: "Regular expressions (regex) are powerful pattern-matching tools used in every programming language. Common patterns include email validation (/^[^@]+@[^@]+\\.[^@]+$/), URL matching, phone numbers, dates, IP addresses, and password strength checks. While regex can be difficult to read, understanding the building blocks — character classes [a-z], quantifiers (+, *, ?), anchors (^, $), and groups (()) — makes any pattern decipherable.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Pattern input */}
      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium">
          Regular Expression
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter a regex pattern..."
            spellCheck={false}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-mono ${
              !isValidRegex && pattern.length > 0
                ? "border-[var(--destructive)]"
                : "border-[var(--border)]"
            } bg-transparent`}
          />
          <CopyButton text={pattern} label="Copy" />
        </div>
        {!isValidRegex && pattern.length > 0 && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            Invalid regular expression
          </p>
        )}
      </div>

      {/* Explanation */}
      {tokens.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Explanation</h3>
            <CopyButton text={explanationText} label="Copy" />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] divide-y divide-[var(--border)]">
            {tokens.map((token, index) => (
              <div key={index} className="flex items-start gap-3 px-4 py-2.5">
                <span className="shrink-0 text-xs text-[var(--muted-foreground)] font-mono mt-0.5 w-6 text-right">
                  {index + 1}.
                </span>
                <code className="shrink-0 rounded bg-[var(--card)] px-2 py-0.5 text-sm font-mono font-semibold border border-[var(--border)]">
                  {token.raw}
                </code>
                <span className="text-sm text-[var(--muted-foreground)]">
                  {token.explanation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Test String</h3>
          {isValidRegex && pattern.trim() && (
            <span className="text-xs font-medium text-[var(--muted-foreground)]">
              {matchCount} match{matchCount !== 1 ? "es" : ""} found
            </span>
          )}
        </div>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={4}
          spellCheck={false}
          placeholder="Enter text to test against the regex..."
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono resize-none mb-3"
        />

        {/* Match highlighting */}
        {isValidRegex && pattern.trim() && testText.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
              Match Highlighting
            </label>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono whitespace-pre-wrap break-all">
              {segments.map((seg, idx) =>
                seg.isMatch ? (
                  <mark
                    key={idx}
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      borderRadius: "2px",
                      padding: "1px 2px",
                    }}
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={idx}>{seg.text}</span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
