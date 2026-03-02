"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

function parseCronField(field: string, min: number, max: number): number[] {
  const values: Set<number> = new Set();

  const parts = field.split(",");
  for (const part of parts) {
    if (part === "*") {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (part.includes("/")) {
      const [range, stepStr] = part.split("/");
      const step = parseInt(stepStr, 10);
      if (isNaN(step) || step <= 0) throw new Error(`Invalid step: ${stepStr}`);
      let start = min;
      let end = max;
      if (range !== "*") {
        if (range.includes("-")) {
          const [a, b] = range.split("-").map(Number);
          start = a;
          end = b;
        } else {
          start = parseInt(range, 10);
        }
      }
      for (let i = start; i <= end; i += step) values.add(i);
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      if (isNaN(a) || isNaN(b)) throw new Error(`Invalid range: ${part}`);
      for (let i = a; i <= b; i++) values.add(i);
    } else {
      const n = parseInt(part, 10);
      if (isNaN(n)) throw new Error(`Invalid value: ${part}`);
      values.add(n);
    }
  }

  for (const v of values) {
    if (v < min || v > max) throw new Error(`Value ${v} out of range (${min}-${max})`);
  }

  return Array.from(values).sort((a, b) => a - b);
}

function matchesCron(date: Date, minutes: number[], hours: number[], days: number[], months: number[], weekdays: number[]): boolean {
  return (
    minutes.includes(date.getMinutes()) &&
    hours.includes(date.getHours()) &&
    days.includes(date.getDate()) &&
    months.includes(date.getMonth() + 1) &&
    weekdays.includes(date.getDay())
  );
}

function getNextRuns(expression: string, count: number): Date[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error("Cron expression must have exactly 5 fields");

  const minutes = parseCronField(parts[0], 0, 59);
  const hours = parseCronField(parts[1], 0, 23);
  const days = parseCronField(parts[2], 1, 31);
  const months = parseCronField(parts[3], 1, 12);
  const weekdays = parseCronField(parts[4], 0, 6);

  const results: Date[] = [];
  const now = new Date();
  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

  const maxIterations = 525600;
  for (let i = 0; i < maxIterations && results.length < count; i++) {
    const check = new Date(current.getTime() + i * 60000);
    if (matchesCron(check, minutes, hours, days, months, weekdays)) {
      results.push(check);
    }
  }

  return results;
}

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function describeField(field: string, type: "minute" | "hour" | "day" | "month" | "weekday"): string {
  if (field === "*") {
    switch (type) {
      case "minute": return "every minute";
      case "hour": return "every hour";
      case "day": return "every day";
      case "month": return "every month";
      case "weekday": return "every day of the week";
    }
  }

  if (field.startsWith("*/")) {
    const step = field.slice(2);
    switch (type) {
      case "minute": return `every ${step} minutes`;
      case "hour": return `every ${step} hours`;
      case "day": return `every ${step} days`;
      case "month": return `every ${step} months`;
      case "weekday": return `every ${step} days of the week`;
    }
  }

  switch (type) {
    case "minute": return `at minute ${field}`;
    case "hour": return `at hour ${field}`;
    case "day": return `on day ${field}`;
    case "month": {
      const nums = field.split(",").map(Number);
      const names = nums.map((n) => MONTH_NAMES[n] || String(n));
      return `in ${names.join(", ")}`;
    }
    case "weekday": {
      if (field.includes("-")) {
        const [a, b] = field.split("-").map(Number);
        return `on ${WEEKDAY_NAMES[a]} through ${WEEKDAY_NAMES[b]}`;
      }
      const nums = field.split(",").map(Number);
      const names = nums.map((n) => WEEKDAY_NAMES[n] || String(n));
      return `on ${names.join(", ")}`;
    }
  }
}

function buildHumanReadable(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (need 5 fields)";

  const [min, hour, day, month, weekday] = parts;

  const pieces: string[] = [];

  // Time description
  if (min !== "*" && hour !== "*" && !min.includes("/") && !hour.includes("/")) {
    const m = min.padStart(2, "0");
    const h = hour.padStart(2, "0");
    pieces.push(`At ${h}:${m}`);
  } else {
    if (min !== "*") pieces.push(describeField(min, "minute"));
    if (hour !== "*") pieces.push(describeField(hour, "hour"));
    if (min === "*" && hour === "*") pieces.push("every minute");
  }

  // Day / month / weekday
  if (day !== "*") pieces.push(describeField(day, "day"));
  if (month !== "*") pieces.push(describeField(month, "month"));
  if (weekday !== "*") pieces.push(describeField(weekday, "weekday"));
  if (day === "*" && month === "*" && weekday === "*") {
    if (!pieces.includes("every minute")) pieces.push("every day");
  }

  return pieces.join(", ");
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "less than a minute";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""}`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hours < 24) {
    return remMins > 0 ? `${hours}h ${remMins}m` : `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return remHours > 0 ? `${days}d ${remHours}h` : `${days} day${days !== 1 ? "s" : ""}`;
}

const presets = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily midnight", value: "0 0 * * *" },
  { label: "Weekly Monday 9am", value: "0 9 * * 1" },
  { label: "Monthly 1st", value: "0 0 1 * *" },
  { label: "Weekdays 8am", value: "0 8 * * 1-5" },
];

export default function CronParser() {
  const [input, setInput] = useState("0 0 * * *");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [error, setError] = useState("");

  const parse = () => {
    try {
      setError("");
      const desc = buildHumanReadable(input);
      setDescription(desc);
      const runs = getNextRuns(input, 5);
      setNextRuns(runs);
    } catch (e) {
      setError((e as Error).message);
      setDescription("");
      setNextRuns([]);
    }
  };

  const applyPreset = (value: string) => {
    setInput(value);
    setError("");
    try {
      const desc = buildHumanReadable(value);
      setDescription(desc);
      const runs = getNextRuns(value, 5);
      setNextRuns(runs);
    } catch (e) {
      setError((e as Error).message);
      setDescription("");
      setNextRuns([]);
    }
  };

  const faqs = [
    {
      question: "What do the 5 fields in a cron expression mean?",
      answer:
        "From left to right: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, Sunday=0). For example, '30 14 * * *' means 'at 2:30 PM every day'.",
    },
    {
      question: "How do I schedule a job to run every 5 minutes?",
      answer:
        "Use */5 in the minute field: '*/5 * * * *'. The slash operator creates step values — */5 means 'every 5th minute starting from 0' (0, 5, 10, 15, ..., 55).",
    },
    {
      question: "What is the difference between day of month and day of week?",
      answer:
        "Day of month (field 3) specifies calendar dates (1-31), while day of week (field 5) specifies weekdays (0-6). When both are set to non-wildcard values, the job runs when EITHER condition is met, not both.",
    },
    {
      question: "Does this support 6-field or 7-field cron expressions?",
      answer:
        "This tool uses the standard 5-field cron format. Some systems like Quartz or Spring add a seconds field (6 fields) or a year field (7 fields). For those formats, remove the extra fields to use this parser.",
    },
  ];

  return (
    <ToolLayout
      title="Cron Expression Parser"
      description="Parse cron expressions into human-readable descriptions and view upcoming execution times."
      slug="cron-parser"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Read and Write Cron Expressions",
              content:
                "Enter a cron expression with 5 fields (minute, hour, day of month, month, day of week) and get a human-readable description plus the next 5 scheduled execution times. This tool supports all standard cron syntax: wildcards (*), ranges (1-5), lists (1,3,5), and step values (*/15). Use the preset buttons to quickly load common schedules like every minute, hourly, daily at midnight, or weekdays at 8am.",
            },
            {
              title: "Cron Expression Syntax Guide",
              content:
                "A cron expression consists of 5 fields separated by spaces: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, where 0 is Sunday). The asterisk (*) means every value, a hyphen (1-5) defines a range, a comma (1,3,5) lists specific values, and a slash (*/15) sets step intervals. For example, '0 9 * * 1-5' means 'at 9:00 AM every weekday', and '*/30 * * * *' means 'every 30 minutes'. Cron is used in Linux crontab, GitHub Actions, Kubernetes CronJobs, AWS CloudWatch Events, and most task schedulers.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Cron Expression</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="* * * * *"
            className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
          <button
            onClick={parse}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
          >
            Parse
          </button>
        </div>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Format: minute (0-59) hour (0-23) day (1-31) month (1-12) weekday (0-6, Sun=0)
        </p>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => applyPreset(p.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {description && !error && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Human-Readable Description</span>
            <CopyButton text={description} />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
            {description}
          </div>
        </div>
      )}

      {nextRuns.length > 0 && !error && (
        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium">Next 5 Execution Times</span>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] overflow-hidden">
            {nextRuns.map((run, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  i < nextRuns.length - 1 ? "border-b border-[var(--border)]" : ""
                }`}
              >
                <span className="font-mono">
                  {run.toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  in {formatRelative(run)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
