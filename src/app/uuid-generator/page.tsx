"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([crypto.randomUUID()]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);

  const generate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const uuid = crypto.randomUUID();
      newUuids.push(uppercase ? uuid.toUpperCase() : uuid);
    }
    setUuids(newUuids);
  };

  const allText = uuids.join("\n");

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random UUID v4 identifiers. Create one or bulk generate multiple UUIDs."
      slug="uuid-generator"
    >
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            min={1}
            max={100}
            className="w-24 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded accent-[var(--primary)]"
          />
          Uppercase
        </label>
        <button
          onClick={generate}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Generate
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {uuids.length} UUID{uuids.length > 1 ? "s" : ""} Generated
          </span>
          <CopyButton text={allText} label={uuids.length > 1 ? "Copy All" : "Copy"} />
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] divide-y divide-[var(--border)] max-h-96 overflow-y-auto">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-2">
              <code className="text-sm font-mono flex-1">{uuid}</code>
              {uuids.length > 1 && <CopyButton text={uuid} label="" className="px-2" />}
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
