"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import SeoContent from "@/components/tools/SeoContent";
import CopyButton from "@/components/tools/CopyButton";

// Returns a local datetime-local string (YYYY-MM-DDTHH:MM) from a Date object
function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getRelativePreview(unixSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = unixSeconds - now;
  const abs = Math.abs(diff);

  const minutes = Math.floor(abs / 60);
  const hours = Math.floor(abs / 3600);
  const days = Math.floor(abs / 86400);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label: string;
  if (abs < 45) {
    label = "a few seconds";
  } else if (abs < 90) {
    label = "a minute";
  } else if (minutes < 45) {
    label = `${minutes} minutes`;
  } else if (hours < 2) {
    label = "an hour";
  } else if (hours < 22) {
    label = `${hours} hours`;
  } else if (days < 2) {
    label = "a day";
  } else if (days < 26) {
    label = `${days} days`;
  } else if (months < 2) {
    label = "a month";
  } else if (months < 12) {
    label = `${months} months`;
  } else if (years < 2) {
    label = "a year";
  } else {
    label = `${years} years`;
  }

  return diff >= 0 ? `in ${label}` : `${label} ago`;
}

interface FormatRow {
  code: string;
  name: string;
  example: string;
  preview: (date: Date) => string;
}

const FORMAT_ROWS: FormatRow[] = [
  {
    code: "t",
    name: "Short Time",
    example: "9:01 AM",
    preview: (d) =>
      d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  },
  {
    code: "T",
    name: "Long Time",
    example: "9:01:00 AM",
    preview: (d) =>
      d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" }),
  },
  {
    code: "d",
    name: "Short Date",
    example: "01/20/2026",
    preview: (d) =>
      d.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "numeric" }),
  },
  {
    code: "D",
    name: "Long Date",
    example: "January 20, 2026",
    preview: (d) =>
      d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
  },
  {
    code: "f",
    name: "Short Date/Time",
    example: "January 20, 2026 9:01 AM",
    preview: (d) =>
      d.toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
  },
  {
    code: "F",
    name: "Long Date/Time",
    example: "Tuesday, January 20, 2026 9:01 AM",
    preview: (d) =>
      d.toLocaleString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
  },
  {
    code: "R",
    name: "Relative Time",
    example: "2 hours ago / in 3 days",
    preview: (d) => getRelativePreview(Math.floor(d.getTime() / 1000)),
  },
];

const faqs = [
  {
    question: "What are Discord timestamps?",
    answer:
      "Discord timestamps are special message tags in the format <t:unix:format> that Discord automatically converts into formatted, localized date and time strings. When you send a message containing a timestamp tag, Discord renders it as a human-readable date for every viewer in their own local timezone.",
  },
  {
    question: "How do I use a timestamp in Discord?",
    answer:
      "Copy the <t:unix:format> tag from this tool, then paste it directly into any Discord message — in a channel, DM, thread, or server. Discord automatically renders it as a formatted date. You do not need any special permissions or bots.",
  },
  {
    question: "What timezone do Discord timestamps use?",
    answer:
      "Discord timestamps always display in the viewer's own local timezone. This makes them ideal for scheduling events across different time zones — everyone sees the correct local time for their location, eliminating confusion about time zone conversions.",
  },
  {
    question: "Can I use timestamps in Discord bots?",
    answer:
      "Yes! Timestamp tags work in all Discord messages, including bot messages and embeds. Just include the <t:unix:format> string in the message content or embed field. Most Discord bot libraries (discord.js, discord.py, etc.) support them directly without any extra configuration.",
  },
];

export default function DiscordTimestamp() {
  const [datetimeValue, setDatetimeValue] = useState(() => toDatetimeLocal(new Date()));
  const [date, setDate] = useState(() => new Date());

  useEffect(() => {
    if (datetimeValue) {
      const parsed = new Date(datetimeValue);
      if (!isNaN(parsed.getTime())) {
        setDate(parsed);
      }
    }
  }, [datetimeValue]);

  const unixSeconds = Math.floor(date.getTime() / 1000);

  const handleNow = () => {
    const now = new Date();
    setDatetimeValue(toDatetimeLocal(now));
    setDate(now);
  };

  return (
    <ToolLayout
      title="Discord Timestamp Generator"
      description="Generate Discord timestamp tags from any date and time. Preview all 7 format styles."
      slug="discord-timestamp"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Use Discord Timestamps in Messages",
              content:
                "Select any date and time using the picker — it defaults to right now. The tool instantly computes the Unix timestamp and generates all 7 Discord timestamp format tags. Click the copy button next to any format to copy the tag. Paste it directly into Discord — in a channel message, DM, announcement, or bot response — and Discord will render it as a formatted date/time in every viewer's local timezone. The default format (f) shows full date and time and is best for event scheduling.",
            },
            {
              title: "All Discord Timestamp Formats Explained",
              content:
                "Discord supports 7 timestamp format codes: t (short time, e.g. 9:01 AM), T (long time with seconds, e.g. 9:01:00 AM), d (short date, e.g. 01/20/2026), D (long date, e.g. January 20, 2026), f (short datetime — the default, e.g. January 20, 2026 9:01 AM), F (long datetime with weekday, e.g. Tuesday, January 20, 2026 9:01 AM), and R (relative time, e.g. in 3 days or 2 hours ago). The R format updates in real-time in Discord — if you send 'in 5 minutes', it will count down automatically for all viewers.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-6">
        {/* Date/Time Input */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Date &amp; Time</label>
            <input
              type="datetime-local"
              value={datetimeValue}
              onChange={(e) => setDatetimeValue(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleNow}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            Use Now
          </button>
        </div>

        {/* Unix Timestamp */}
        <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
          <div className="flex-1">
            <span className="block text-xs text-[var(--muted-foreground)] mb-0.5">
              Unix Timestamp (seconds)
            </span>
            <code className="text-sm font-mono font-semibold">{unixSeconds}</code>
          </div>
          <CopyButton text={String(unixSeconds)} />
        </div>

        {/* Formats Table */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            All 7 Discord Timestamp Formats
          </h2>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  <th className="px-4 py-2.5 w-10">Code</th>
                  <th className="px-4 py-2.5">Style</th>
                  <th className="px-4 py-2.5 hidden sm:table-cell">Preview</th>
                  <th className="px-4 py-2.5">Tag</th>
                  <th className="px-4 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                {FORMAT_ROWS.map((row) => {
                  const tag = `<t:${unixSeconds}:${row.code}>`;
                  const previewText = row.preview(date);
                  return (
                    <tr key={row.code} className="hover:bg-[var(--muted)] transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[var(--primary)]">
                        {row.code}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)] whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-[var(--foreground)]">
                        {previewText}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--foreground)] max-w-0 w-full">
                        <span className="block truncate">{tag}</span>
                        {/* Mobile: show preview below tag */}
                        <span className="sm:hidden block text-[var(--muted-foreground)] text-xs mt-0.5">
                          {previewText}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <CopyButton text={tag} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick tip */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
          <strong className="text-[var(--foreground)]">Tip:</strong> Paste any{" "}
          <code className="font-mono text-xs bg-[var(--card)] border border-[var(--border)] rounded px-1 py-0.5">
            &lt;t:unix:format&gt;
          </code>{" "}
          tag directly into Discord and it renders automatically for all viewers in their local
          timezone. The{" "}
          <code className="font-mono text-xs bg-[var(--card)] border border-[var(--border)] rounded px-1 py-0.5">
            R
          </code>{" "}
          (relative) format updates in real-time.
        </div>
      </div>
    </ToolLayout>
  );
}
