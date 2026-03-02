"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let label: string;
  if (days > 0) {
    label = `${days} day${days !== 1 ? "s" : ""}`;
  } else if (hours > 0) {
    label = `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    label = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    label = `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }

  return isFuture ? `in ${label}` : `${label} ago`;
}

export default function TimestampConverterTool() {
  const [tsInput, setTsInput] = useState("");
  const [tsUnit, setTsUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [tsResult, setTsResult] = useState<{
    utc: string;
    local: string;
    iso: string;
    relative: string;
  } | null>(null);
  const [tsError, setTsError] = useState("");

  const [dateInput, setDateInput] = useState("");
  const [dateResult, setDateResult] = useState<{
    seconds: string;
    milliseconds: string;
  } | null>(null);
  const [dateError, setDateError] = useState("");

  const handleTimestampToDate = () => {
    setTsError("");
    setTsResult(null);

    const num = Number(tsInput.trim());
    if (!tsInput.trim() || isNaN(num)) {
      setTsError("Please enter a valid numeric timestamp.");
      return;
    }

    const ms = tsUnit === "seconds" ? num * 1000 : num;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setTsError("Invalid timestamp value.");
      return;
    }

    setTsResult({
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      iso: date.toISOString(),
      relative: getRelativeTime(ms),
    });
  };

  const handleDateToTimestamp = () => {
    setDateError("");
    setDateResult(null);

    if (!dateInput) {
      setDateError("Please select a date and time.");
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setDateError("Invalid date value.");
      return;
    }

    const ms = date.getTime();
    setDateResult({
      seconds: String(Math.floor(ms / 1000)),
      milliseconds: String(ms),
    });
  };

  const handleNow = () => {
    const now = Date.now();
    if (tsUnit === "seconds") {
      setTsInput(String(Math.floor(now / 1000)));
    } else {
      setTsInput(String(now));
    }
  };

  return (
    <ToolLayout
      title="Unix Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates."
      slug="timestamp-converter"
    >
      <div className="space-y-6">
        {/* Timestamp to Date */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Timestamp to Date</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">Timestamp</label>
              <input
                type="number"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder="e.g. 1700000000"
                className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Unit</label>
              <select
                value={tsUnit}
                onChange={(e) => setTsUnit(e.target.value as "seconds" | "milliseconds")}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm"
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleTimestampToDate}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
            >
              Convert
            </button>
            <button
              onClick={handleNow}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              Now
            </button>
          </div>

          {tsError && (
            <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
              {tsError}
            </div>
          )}

          {tsResult && (
            <div className="mt-3 space-y-2">
              {([
                ["UTC", tsResult.utc],
                ["Local", tsResult.local],
                ["ISO 8601", tsResult.iso],
                ["Relative", tsResult.relative],
              ] as const).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
                  <div>
                    <span className="text-xs text-[var(--muted-foreground)] font-sans">{label}</span>
                    <p>{value}</p>
                  </div>
                  <CopyButton text={value} />
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="border-[var(--border)]" />

        {/* Date to Timestamp */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Date to Timestamp</h2>

          <div>
            <label className="mb-1 block text-sm font-medium">Date &amp; Time</label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
            />
          </div>

          <button
            onClick={handleDateToTimestamp}
            className="mt-3 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
          >
            Convert
          </button>

          {dateError && (
            <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
              {dateError}
            </div>
          )}

          {dateResult && (
            <div className="mt-3 space-y-2">
              {([
                ["Seconds", dateResult.seconds],
                ["Milliseconds", dateResult.milliseconds],
              ] as const).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto">
                  <div>
                    <span className="text-xs text-[var(--muted-foreground)] font-sans">{label}</span>
                    <p>{value}</p>
                  </div>
                  <CopyButton text={value} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
