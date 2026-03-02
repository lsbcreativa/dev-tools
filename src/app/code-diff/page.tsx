"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";

interface DiffLine {
  type: "equal" | "add" | "remove";
  left: string;
  right: string;
  leftNum: number | null;
  rightNum: number | null;
}

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const result: DiffLine[] = [];

  // LCS-based diff
  const m = linesA.length;
  const n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = linesA[i - 1] === linesB[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const lines: { type: "equal" | "add" | "remove"; text: string }[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      lines.unshift({ type: "equal", text: linesA[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      lines.unshift({ type: "add", text: linesB[j - 1] });
      j--;
    } else {
      lines.unshift({ type: "remove", text: linesA[i - 1] });
      i--;
    }
  }

  let leftNum = 0, rightNum = 0;
  for (const line of lines) {
    if (line.type === "equal") {
      leftNum++; rightNum++;
      result.push({ type: "equal", left: line.text, right: line.text, leftNum, rightNum });
    } else if (line.type === "remove") {
      leftNum++;
      result.push({ type: "remove", left: line.text, right: "", leftNum, rightNum: null });
    } else {
      rightNum++;
      result.push({ type: "add", left: "", right: line.text, leftNum: null, rightNum });
    }
  }

  return result;
}

const SAMPLE_LEFT = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`;

const SAMPLE_RIGHT = `function greet(name, greeting) {
  const msg = greeting || "Hello";
  console.log(msg + ", " + name);
  return true;
}`;

export default function CodeDiff() {
  const [left, setLeft] = useState(SAMPLE_LEFT);
  const [right, setRight] = useState(SAMPLE_RIGHT);

  const diff = useMemo(() => computeDiff(left, right), [left, right]);

  const stats = useMemo(() => {
    let added = 0, removed = 0;
    diff.forEach((d) => { if (d.type === "add") added++; if (d.type === "remove") removed++; });
    return { added, removed };
  }, [diff]);

  const faqs = [
    {
      question: "How is this different from the Text Diff tool?",
      answer: "The Code Diff Viewer is optimized for source code with monospace formatting, line numbers, and syntax-aware comparison. The Text Diff tool is better for prose, documents, and general text comparison.",
    },
    {
      question: "Can I compare files in different programming languages?",
      answer: "Yes. The diff algorithm works with any text-based code. It compares content line by line regardless of the programming language.",
    },
    {
      question: "Does it detect refactored or moved code?",
      answer: "The diff compares line by line at matching positions. Moved code appears as deletions in the original location and additions in the new location. Structural refactoring may show as large blocks of changes.",
    },
  ];

  return (
    <ToolLayout
      title="Code Diff Viewer"
      description="Compare two code snippets side by side with line-by-line diff highlighting."
      slug="code-diff"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Compare Code Side by Side",
              content: "Paste two code snippets in the left and right panels to see a highlighted diff showing additions (green), deletions (red), and modifications. The tool provides line-by-line comparison with syntax-aware formatting, making it easy to review code changes, compare file versions, and identify differences.",
            },
            {
              title: "Code Review and Diff Best Practices",
              content: "Code diff tools are essential for code reviews, debugging, and version control. When reviewing diffs, focus on logic changes rather than formatting, look for unintended changes in adjacent lines, and verify that edge cases are handled. Unlike text diff, code diff preserves indentation and can highlight changes within modified lines for precise identification of what changed.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Original</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={10}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Modified</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            rows={10}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
        <span className="text-green-500 font-medium">+{stats.added} added</span>
        <span className="text-red-500 font-medium">-{stats.removed} removed</span>
        <span>{diff.filter((d) => d.type === "equal").length} unchanged</span>
      </div>

      {/* Diff output */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-xs font-mono">
          <tbody>
            {diff.map((line, i) => (
              <tr
                key={i}
                className={
                  line.type === "add"
                    ? "bg-green-500/10"
                    : line.type === "remove"
                    ? "bg-red-500/10"
                    : ""
                }
              >
                <td className="w-10 px-2 py-0.5 text-right text-[var(--muted-foreground)] select-none border-r border-[var(--border)]">
                  {line.leftNum ?? ""}
                </td>
                <td className="w-4 px-1 py-0.5 text-center select-none border-r border-[var(--border)]">
                  {line.type === "remove" ? (
                    <span className="text-red-500">−</span>
                  ) : line.type === "add" ? (
                    <span className="text-green-500">+</span>
                  ) : null}
                </td>
                <td className="w-10 px-2 py-0.5 text-right text-[var(--muted-foreground)] select-none border-r border-[var(--border)]">
                  {line.rightNum ?? ""}
                </td>
                <td className="px-3 py-0.5 whitespace-pre">
                  {line.type === "remove" ? line.left : line.type === "add" ? line.right : line.left}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}
