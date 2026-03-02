"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ---------- Types ---------- */

interface Flag {
  flag: string;
  label: string;
  description: string;
}

interface GitOp {
  name: string;
  base: string;
  argPlaceholder?: string;
  flags: Flag[];
  description: string;
}

/* ---------- Operations ---------- */

const GIT_OPS: GitOp[] = [
  {
    name: "merge",
    base: "git merge",
    argPlaceholder: "branch-name",
    description: "Join two or more development histories together.",
    flags: [
      { flag: "--no-ff", label: "No fast-forward", description: "Always create a merge commit, even if fast-forward is possible." },
      { flag: "--squash", label: "Squash", description: "Combine all commits from the branch into one commit." },
      { flag: "--abort", label: "Abort", description: "Abort the current merge and restore the pre-merge state." },
      { flag: "--no-commit", label: "No commit", description: "Perform the merge but don't auto-commit, allowing you to inspect." },
    ],
  },
  {
    name: "rebase",
    base: "git rebase",
    argPlaceholder: "branch-name",
    description: "Reapply commits on top of another base tip.",
    flags: [
      { flag: "--interactive", label: "Interactive (-i)", description: "Open an editor to reorder, squash, or edit commits." },
      { flag: "--onto", label: "Onto", description: "Rebase onto a different branch than the upstream." },
      { flag: "--abort", label: "Abort", description: "Abort the rebase and return to the original branch state." },
      { flag: "--continue", label: "Continue", description: "Continue the rebase after resolving conflicts." },
    ],
  },
  {
    name: "reset",
    base: "git reset",
    argPlaceholder: "commit-hash",
    description: "Reset current HEAD to a specified state.",
    flags: [
      { flag: "--soft", label: "Soft", description: "Keep changes staged. Only move HEAD pointer." },
      { flag: "--mixed", label: "Mixed (default)", description: "Unstage changes but keep them in working directory." },
      { flag: "--hard", label: "Hard", description: "Discard all changes. Working directory matches the commit." },
    ],
  },
  {
    name: "stash",
    base: "git stash",
    argPlaceholder: "",
    description: "Stash changes in a dirty working directory.",
    flags: [
      { flag: "push", label: "Push (save)", description: "Save your changes to a new stash entry." },
      { flag: "pop", label: "Pop", description: "Apply the most recent stash and remove it from the stash list." },
      { flag: "list", label: "List", description: "List all stash entries." },
      { flag: "apply", label: "Apply", description: "Apply a stash without removing it from the stash list." },
    ],
  },
  {
    name: "cherry-pick",
    base: "git cherry-pick",
    argPlaceholder: "commit-hash",
    description: "Apply the changes from a specific commit onto the current branch.",
    flags: [
      { flag: "--no-commit", label: "No commit", description: "Apply changes but don't create a commit automatically." },
      { flag: "--edit", label: "Edit message", description: "Open editor to modify the commit message." },
      { flag: "--abort", label: "Abort", description: "Cancel the cherry-pick and restore the original state." },
    ],
  },
  {
    name: "log",
    base: "git log",
    argPlaceholder: "",
    description: "Show commit history.",
    flags: [
      { flag: "--oneline", label: "One line", description: "Show each commit on a single line (short hash + message)." },
      { flag: "--graph", label: "Graph", description: "Draw a text-based graph of the branch structure." },
      { flag: "--all", label: "All branches", description: "Show commits from all branches, not just the current one." },
      { flag: "-n 10", label: "Last 10", description: "Limit output to the last 10 commits." },
    ],
  },
  {
    name: "branch",
    base: "git branch",
    argPlaceholder: "branch-name",
    description: "List, create, or delete branches.",
    flags: [
      { flag: "-a", label: "All (local + remote)", description: "List both local and remote-tracking branches." },
      { flag: "-d", label: "Delete", description: "Delete a fully merged branch." },
      { flag: "-D", label: "Force delete", description: "Force delete a branch even if it's not fully merged." },
      { flag: "-m", label: "Rename", description: "Rename the current branch." },
    ],
  },
  {
    name: "remote",
    base: "git remote",
    argPlaceholder: "",
    description: "Manage set of tracked repositories.",
    flags: [
      { flag: "-v", label: "Verbose", description: "Show remote URLs along with their names." },
      { flag: "add origin", label: "Add origin", description: "Add a new remote named 'origin'." },
      { flag: "remove origin", label: "Remove origin", description: "Remove the remote named 'origin'." },
    ],
  },
];

/* ---------- Component ---------- */

export default function GitCommandBuilderPage() {
  const [selectedOp, setSelectedOp] = useState(0);
  const [selectedFlags, setSelectedFlags] = useState<Set<number>>(new Set());
  const [arg, setArg] = useState("");

  const op = GIT_OPS[selectedOp];

  const toggleFlag = (i: number) => {
    setSelectedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const command = useMemo(() => {
    const parts = [op.base];
    op.flags.forEach((f, i) => {
      if (selectedFlags.has(i)) parts.push(f.flag);
    });
    if (arg.trim()) parts.push(arg.trim());
    return parts.join(" ");
  }, [op, selectedFlags, arg]);

  const faqs = [
    {
      question: "What is the difference between git merge and git rebase?",
      answer: "Merge creates a merge commit preserving both branch histories. Rebase replays your commits on top of the target branch, creating a linear history. Use merge for shared branches, rebase for cleaning up local feature branches before merging.",
    },
    {
      question: "When should I use git reset --hard?",
      answer: "git reset --hard discards ALL uncommitted changes permanently. Use it only when you're certain you want to discard everything. For safer alternatives, use --soft (keep changes staged) or --mixed (keep changes unstaged).",
    },
    {
      question: "What does git stash do?",
      answer: "git stash temporarily saves your uncommitted changes (both staged and unstaged) and reverts your working directory to the last commit. Use git stash pop to restore the changes later. It's useful when you need to switch branches without committing.",
    },
  ];

  return (
    <ToolLayout
      title="Git Command Builder"
      description="Build git commands visually with dropdowns and checkboxes. Merge, rebase, reset, stash and more explained."
      slug="git-command-builder"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Build Git Commands Visually",
              content: "Select a git operation (merge, rebase, reset, stash, cherry-pick, log, branch, remote), then use checkboxes and dropdowns to configure flags and options. The tool generates the complete git command with explanations for each flag. Copy the command and run it in your terminal.",
            },
            {
              title: "Essential Git Operations Explained",
              content: "Git merge combines branches by creating a merge commit. Git rebase replays commits on top of another branch for a linear history. Git reset moves HEAD to undo commits (--soft keeps changes staged, --mixed unstages, --hard discards). Git stash temporarily saves uncommitted changes. Git cherry-pick copies specific commits between branches. Understanding when to use each operation is crucial for maintaining a clean git history.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Operation selector */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Operation</label>
        <div className="flex flex-wrap gap-2">
          {GIT_OPS.map((g, i) => (
            <button
              key={g.name}
              onClick={() => {
                setSelectedOp(i);
                setSelectedFlags(new Set());
                setArg("");
              }}
              className={`rounded-lg border px-3 py-2 text-sm font-mono font-medium transition-colors btn-press ${
                selectedOp === i
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm text-[var(--muted-foreground)]">
        {op.description}
      </div>

      {/* Argument */}
      {op.argPlaceholder && (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Argument</label>
          <input
            type="text"
            value={arg}
            onChange={(e) => setArg(e.target.value)}
            placeholder={op.argPlaceholder}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-mono"
          />
        </div>
      )}

      {/* Flags */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Flags / Options</label>
        <div className="space-y-2">
          {op.flags.map((f, i) => (
            <label
              key={f.flag}
              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                selectedFlags.has(i)
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] hover:bg-[var(--muted)]"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFlags.has(i)}
                onChange={() => toggleFlag(i)}
                className="mt-0.5 shrink-0"
              />
              <div>
                <span className="text-sm font-mono font-medium">{f.flag}</span>
                <span className="ml-2 text-sm text-[var(--muted-foreground)]">
                  — {f.label}
                </span>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {f.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Output command */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Generated Command</span>
          <CopyButton text={command} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
          <span className="text-[var(--primary)]">$</span> {command}
        </pre>
      </div>
    </ToolLayout>
  );
}
