"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

interface PermissionGroup {
  read: boolean;
  write: boolean;
  execute: boolean;
}

type Permissions = [PermissionGroup, PermissionGroup, PermissionGroup];

const defaultPermissions: Permissions = [
  { read: true, write: true, execute: true },
  { read: true, write: false, execute: true },
  { read: true, write: false, execute: true },
];

const presets: { label: string; value: string }[] = [
  { label: "755", value: "755" },
  { label: "644", value: "644" },
  { label: "777", value: "777" },
  { label: "600", value: "600" },
  { label: "400", value: "400" },
  { label: "444", value: "444" },
];

const groupLabels = ["Owner", "Group", "Others"];
const permLabels = ["Read", "Write", "Execute"] as const;
const permKeys: (keyof PermissionGroup)[] = ["read", "write", "execute"];
const permValues = { read: 4, write: 2, execute: 1 };

function permGroupToNum(g: PermissionGroup): number {
  return (g.read ? 4 : 0) + (g.write ? 2 : 0) + (g.execute ? 1 : 0);
}

function numToPermGroup(n: number): PermissionGroup {
  return {
    read: (n & 4) !== 0,
    write: (n & 2) !== 0,
    execute: (n & 1) !== 0,
  };
}

function permToSymbolic(perms: Permissions): string {
  return perms
    .map(
      (g) =>
        (g.read ? "r" : "-") + (g.write ? "w" : "-") + (g.execute ? "x" : "-")
    )
    .join("");
}

function permToNumeric(perms: Permissions): string {
  return perms.map(permGroupToNum).join("");
}

export default function ChmodCalculatorTool() {
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions);
  const [numericInput, setNumericInput] = useState(permToNumeric(defaultPermissions));

  const numeric = permToNumeric(permissions);
  const symbolic = permToSymbolic(permissions);

  const updateFromCheckbox = useCallback(
    (groupIndex: number, key: keyof PermissionGroup, value: boolean) => {
      setPermissions((prev) => {
        const next = prev.map((g) => ({ ...g })) as Permissions;
        next[groupIndex][key] = value;
        setNumericInput(permToNumeric(next));
        return next;
      });
    },
    []
  );

  const updateFromNumeric = useCallback((value: string) => {
    setNumericInput(value);
    // Only update checkboxes if we have a valid 3-digit octal string
    if (/^[0-7]{3}$/.test(value)) {
      const digits = value.split("").map(Number);
      setPermissions(
        digits.map((d) => numToPermGroup(d)) as Permissions
      );
    }
  }, []);

  const applyPreset = useCallback((value: string) => {
    updateFromNumeric(value);
  }, [updateFromNumeric]);

  const commandExample = `chmod ${numeric} filename`;

  const faqs = [
    {
      question: "What does chmod 755 mean?",
      answer: "755 means the owner has full permissions (read+write+execute = 7), while group and others have read and execute permissions (read+execute = 5). This is the standard permission for executable scripts and public directories.",
    },
    {
      question: "What is the difference between 644 and 755?",
      answer: "644 (rw-r--r--) allows the owner to read and write, others can only read. 755 (rwxr-xr-x) adds execute permission. Use 644 for regular files (HTML, CSS, images) and 755 for scripts, executables, and directories.",
    },
    {
      question: "Why does the execute permission matter for directories?",
      answer: "For directories, the execute permission means the ability to enter the directory (cd) and access files within it. Without execute permission on a directory, you cannot list or access its contents even if the files inside have read permission.",
    },
  ];

  return (
    <ToolLayout
      title="Chmod Calculator"
      description="Calculate Unix file permissions interactively. Convert between numeric and symbolic notation."
      slug="chmod-calculator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Calculate Unix File Permissions",
              content: "Use the interactive checkboxes to set read (r), write (w), and execute (x) permissions for owner, group, and others \u2014 or enter a numeric value like 755 to see the symbolic representation. The tool shows both formats simultaneously: numeric (755) and symbolic (rwxr-xr-x), plus the equivalent chmod command.",
            },
            {
              title: "Understanding Unix Permission System",
              content: "Unix/Linux file permissions control who can read, write, and execute files. Each file has three permission groups: owner (u), group (g), and others (o). Each group has three permission bits: read (4), write (2), and execute (1). Common permissions include 755 (owner full, others read+execute) for scripts and executables, 644 (owner read+write, others read-only) for regular files, and 700 (owner full, no access for others) for private directories.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Presets */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Common Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => applyPreset(p.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors btn-press ${
                numeric === p.value
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Numeric input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Numeric Value</label>
        <input
          type="text"
          value={numericInput}
          onChange={(e) => updateFromNumeric(e.target.value)}
          maxLength={3}
          placeholder="755"
          className="w-24 rounded-lg border border-[var(--border)] p-3 text-sm font-mono text-center"
        />
        {numericInput && !/^[0-7]{0,3}$/.test(numericInput) && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            Enter a valid 3-digit octal number (digits 0-7)
          </p>
        )}
      </div>

      {/* Permission checkboxes */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-2 text-left font-medium">Group</th>
              {permLabels.map((label) => (
                <th key={label} className="py-2 text-center font-medium">
                  {label}
                </th>
              ))}
              <th className="py-2 text-center font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {groupLabels.map((group, gi) => (
              <tr key={group} className="border-b border-[var(--border)]">
                <td className="py-3 font-medium">{group}</td>
                {permKeys.map((key, ki) => (
                  <td key={key} className="py-3 text-center">
                    <input
                      type="checkbox"
                      checked={permissions[gi][key]}
                      onChange={(e) =>
                        updateFromCheckbox(gi, key, e.target.checked)
                      }
                      className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
                      aria-label={`${group} ${permLabels[ki]}`}
                    />
                  </td>
                ))}
                <td className="py-3 text-center font-mono">
                  {permGroupToNum(permissions[gi])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Numeric</span>
            <CopyButton text={numeric} />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono text-center text-2xl">
            {numeric}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Symbolic</span>
            <CopyButton text={symbolic} />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono text-center text-2xl">
            {symbolic}
          </div>
        </div>
      </div>

      {/* Command example */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Command</span>
          <CopyButton text={commandExample} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
          {commandExample}
        </pre>
      </div>
    </ToolLayout>
  );
}
