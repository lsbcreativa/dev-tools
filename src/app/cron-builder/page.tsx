"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

interface CronField {
  mode: "every" | "specific" | "interval";
  value: string;
  interval: string;
}

const FIELD_DEFS = [
  { label: "Minute", range: "0-59", min: 0, max: 59 },
  { label: "Hour", range: "0-23", min: 0, max: 23 },
  { label: "Day of Month", range: "1-31", min: 1, max: 31 },
  { label: "Month", range: "1-12", min: 1, max: 12 },
  { label: "Day of Week", range: "0-6", min: 0, max: 6 },
];

const PRESETS = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Hourly", cron: "0 * * * *" },
  { label: "Daily at midnight", cron: "0 0 * * *" },
  { label: "Weekly (Monday 9AM)", cron: "0 9 * * 1" },
  { label: "Monthly (1st midnight)", cron: "0 0 1 * *" },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function parseCronString(cron: string): CronField[] {
  const parts = cron.split(" ");
  return parts.map((part) => {
    if (part === "*") {
      return { mode: "every", value: "", interval: "" };
    }
    if (part.startsWith("*/")) {
      return { mode: "interval", value: "", interval: part.slice(2) };
    }
    return { mode: "specific", value: part, interval: "" };
  });
}

function fieldToString(field: CronField): string {
  if (field.mode === "every") return "*";
  if (field.mode === "interval") return `*/${field.interval || "1"}`;
  return field.value || "*";
}

function buildDescription(fields: CronField[]): string {
  const parts: string[] = [];
  const [minute, hour, dom, month, dow] = fields;

  // Minute
  if (minute.mode === "every") {
    parts.push("Every minute");
  } else if (minute.mode === "interval") {
    parts.push(`Every ${minute.interval || 1} minute(s)`);
  } else {
    parts.push(`At minute ${minute.value}`);
  }

  // Hour
  if (hour.mode === "every") {
    parts.push("of every hour");
  } else if (hour.mode === "interval") {
    parts.push(`every ${hour.interval || 1} hour(s)`);
  } else {
    parts.push(`past hour ${hour.value}`);
  }

  // Day of month
  if (dom.mode === "specific") {
    parts.push(`on day ${dom.value} of the month`);
  }

  // Month
  if (month.mode === "specific") {
    const monthNum = parseInt(month.value, 10);
    const name = monthNum >= 1 && monthNum <= 12 ? MONTH_NAMES[monthNum] : month.value;
    parts.push(`in ${name}`);
  }

  // Day of week
  if (dow.mode === "specific") {
    const dayNum = parseInt(dow.value, 10);
    const name = dayNum >= 0 && dayNum <= 6 ? DAY_NAMES[dayNum] : dow.value;
    parts.push(`on ${name}`);
  }

  return parts.join(", ");
}

function matchesField(value: number, fieldStr: string): boolean {
  if (fieldStr === "*") return true;
  if (fieldStr.startsWith("*/")) {
    const interval = parseInt(fieldStr.slice(2), 10);
    return interval > 0 && value % interval === 0;
  }
  // Comma-separated list
  const values = fieldStr.split(",").map((v) => parseInt(v.trim(), 10));
  return values.includes(value);
}

function getNextExecutions(cronStr: string, count: number): Date[] {
  const parts = cronStr.split(" ");
  if (parts.length !== 5) return [];

  const [minField, hourField, domField, monthField, dowField] = parts;
  const results: Date[] = [];
  const now = new Date();
  const candidate = new Date(now);
  candidate.setSeconds(0, 0);
  candidate.setMinutes(candidate.getMinutes() + 1);

  const maxIterations = 525600; // 1 year of minutes
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    const month = candidate.getMonth() + 1;
    const dom = candidate.getDate();
    const dow = candidate.getDay();
    const hour = candidate.getHours();
    const minute = candidate.getMinutes();

    if (
      matchesField(minute, minField) &&
      matchesField(hour, hourField) &&
      matchesField(dom, domField) &&
      matchesField(month, monthField) &&
      matchesField(dow, dowField)
    ) {
      results.push(new Date(candidate));
    }

    candidate.setMinutes(candidate.getMinutes() + 1);
    iterations++;
  }

  return results;
}

export default function CronBuilder() {
  const [fields, setFields] = useState<CronField[]>([
    { mode: "every", value: "", interval: "" },
    { mode: "every", value: "", interval: "" },
    { mode: "every", value: "", interval: "" },
    { mode: "every", value: "", interval: "" },
    { mode: "every", value: "", interval: "" },
  ]);

  const cronExpression = fields.map(fieldToString).join(" ");
  const description = useMemo(() => buildDescription(fields), [fields]);
  const nextRuns = useMemo(() => getNextExecutions(cronExpression, 5), [cronExpression]);

  const updateField = (index: number, updates: Partial<CronField>) => {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const applyPreset = (cron: string) => {
    setFields(parseCronString(cron));
  };

  // Determine if field supports intervals (minute and hour)
  const supportsInterval = (index: number) => index <= 1;

  return (
    <ToolLayout
      title="Crontab Visual Builder"
      description="Build cron expressions visually. See human-readable descriptions and next execution times."
      slug="cron-builder"
    >
      <div className="space-y-6">
        {/* Quick Presets */}
        <div>
          <label className="mb-2 block text-sm font-medium">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.cron}
                onClick={() => applyPreset(preset.cron)}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-all hover:bg-[var(--muted)] btn-press"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Field Editors */}
        <div className="space-y-3">
          {FIELD_DEFS.map((def, index) => (
            <div
              key={def.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium w-32 shrink-0">
                  {def.label}{" "}
                  <span className="text-xs text-[var(--muted-foreground)]">
                    ({def.range})
                  </span>
                </span>

                <select
                  value={fields[index].mode}
                  onChange={(e) => {
                    const mode = e.target.value as CronField["mode"];
                    updateField(index, {
                      mode,
                      value: mode === "specific" ? String(def.min) : "",
                      interval: mode === "interval" ? "5" : "",
                    });
                  }}
                  className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                >
                  <option value="every">Every (wildcard *)</option>
                  <option value="specific">Specific value(s)</option>
                  {supportsInterval(index) && (
                    <option value="interval">Interval (*/n)</option>
                  )}
                </select>

                {fields[index].mode === "specific" && (
                  <input
                    type="text"
                    value={fields[index].value}
                    onChange={(e) => updateField(index, { value: e.target.value })}
                    placeholder={`e.g. ${def.min} or ${def.min},${def.min + 1}`}
                    className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                )}

                {fields[index].mode === "interval" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--muted-foreground)]">*/</span>
                    <select
                      value={fields[index].interval}
                      onChange={(e) => updateField(index, { interval: e.target.value })}
                      className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                    >
                      {[2, 3, 5, 10, 15, 20, 30].map((n) => (
                        <option key={n} value={String(n)}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Cron Expression</label>
            <CopyButton text={cronExpression} />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-center text-xl font-mono font-bold tracking-wider">
            {cronExpression}
          </div>
        </div>

        {/* Human-readable description */}
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm">
            {description}
          </div>
        </div>

        {/* Next 5 executions */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Next 5 Execution Times
          </label>
          {nextRuns.length > 0 ? (
            <div className="space-y-1">
              {nextRuns.map((date, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-mono"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white shrink-0">
                    {i + 1}
                  </span>
                  {date.toLocaleString()}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm text-[var(--muted-foreground)]">
              No executions found within the next year.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
