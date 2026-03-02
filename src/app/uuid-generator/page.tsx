"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

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

  const faqs = [
    {
      question: "Are these UUIDs truly random and unique?",
      answer:
        "Yes. UUIDs are generated using crypto.randomUUID(), which uses the Web Crypto API for cryptographically secure random number generation. The 122 bits of randomness make collisions practically impossible.",
    },
    {
      question: "What is the difference between UUID v1 and UUID v4?",
      answer:
        "UUID v1 includes a timestamp and MAC address, making it partially predictable and potentially leaking device information. UUID v4 is entirely random, making it the preferred choice for most applications where privacy and unpredictability matter.",
    },
    {
      question: "Can I use these UUIDs as database primary keys?",
      answer:
        "Yes, UUID v4 is widely used as primary keys in PostgreSQL, MySQL, MongoDB, and other databases. Consider using ULID or UUID v7 if you need sortable identifiers, as UUID v4 is not time-ordered.",
    },
    {
      question: "How many UUIDs can I generate at once?",
      answer:
        "This tool supports generating up to 100 UUIDs in a single batch. Each UUID is generated independently using the browser's cryptographic API, and you can copy them all at once or individually.",
    },
  ];

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random UUID v4 identifiers. Create one or bulk generate multiple UUIDs."
      slug="uuid-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Generate UUIDs Online",
              content:
                "Click Generate to create random UUID v4 identifiers instantly. You can generate up to 100 UUIDs at once, toggle uppercase formatting, and copy individual UUIDs or all of them at once. All UUIDs are generated client-side using the Web Crypto API (crypto.randomUUID), ensuring cryptographically secure random values that never leave your browser.",
            },
            {
              title: "Understanding UUID v4 Format",
              content:
                "UUID v4 (Universally Unique Identifier version 4) is a 128-bit identifier formatted as 32 hexadecimal digits in 5 groups separated by hyphens: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx. The '4' in the third group indicates version 4 (random), and the 'y' digit is constrained to 8, 9, a, or b to indicate the variant. With 122 random bits, the probability of generating duplicate UUIDs is astronomically low — you would need to generate 1 billion UUIDs per second for 86 years to have a 50% chance of a single collision.",
            },
          ]}
          faqs={faqs}
        />
      }
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
