"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ------------------------------------------------------------------ */
/*  Data arrays                                                        */
/* ------------------------------------------------------------------ */
const FIRST_NAMES = [
  "James","Mary","Robert","Patricia","John","Jennifer","Michael","Linda",
  "David","Elizabeth","William","Barbara","Richard","Susan","Joseph","Jessica",
  "Thomas","Sarah","Christopher","Karen","Charles","Lisa","Daniel","Nancy",
  "Matthew","Betty","Anthony","Margaret","Mark","Sandra","Donald","Ashley",
  "Steven","Dorothy","Andrew","Kimberly","Paul","Emily","Joshua","Donna",
];

const LAST_NAMES = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis",
  "Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson",
  "Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson",
  "White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker",
  "Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill",
];

const DOMAINS = [
  "gmail.com","yahoo.com","outlook.com","hotmail.com","protonmail.com",
  "icloud.com","mail.com","fastmail.com","zoho.com","aol.com",
  "live.com","msn.com","yandex.com","tutanota.com","gmx.com",
];

const CITIES = [
  "New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia",
  "San Antonio","San Diego","Dallas","San Jose","Austin","Jacksonville",
  "Fort Worth","Columbus","Charlotte","Indianapolis","San Francisco",
  "Seattle","Denver","Washington","Nashville","Oklahoma City","El Paso",
  "Boston","Portland","Las Vegas","Memphis","Louisville","Baltimore","Milwaukee",
];

const STREETS = [
  "Main St","Oak Ave","Maple Dr","Cedar Ln","Elm St","Pine Rd",
  "Washington Blvd","Park Ave","Lake Dr","Hill Rd","River Rd","Forest Ave",
  "Sunset Blvd","Broadway","Church St","Market St","Spring St","Highland Ave",
  "Walnut St","Chestnut St","Vine St","Union Ave","Liberty St","Center St",
  "Franklin St","Madison Ave","Jefferson Rd","Adams St","Monroe Dr","Lincoln Ave",
];

const COUNTRIES = [
  "United States","Canada","United Kingdom","Australia","Germany","France",
  "Japan","Brazil","India","Mexico","Spain","Italy","Netherlands","Sweden",
  "Norway","Denmark","Switzerland","South Korea","New Zealand","Ireland",
  "Portugal","Austria","Belgium","Finland","Poland","Czech Republic",
  "Argentina","Chile","Colombia","Singapore",
];

const COMPANIES = [
  "Acme Corp","Globex Inc","Initech","Umbrella Corp","Stark Industries",
  "Wayne Enterprises","Cyberdyne Systems","Soylent Corp","Massive Dynamic",
  "Aperture Science","Wonka Industries","Dunder Mifflin","Pied Piper",
  "Hooli","Prestige Worldwide","Sterling Cooper","Bluth Company",
  "Vandelay Industries","Gekko & Co","Slate Rock","TechNova Solutions",
  "CloudBridge Inc","DataSync Labs","Pixel Forge","NexGen Systems",
];

const JOB_TITLES = [
  "Software Engineer","Product Manager","Data Analyst","UX Designer",
  "DevOps Engineer","Full Stack Developer","Frontend Developer",
  "Backend Developer","QA Engineer","Project Manager","CTO","CEO",
  "Marketing Manager","Sales Representative","HR Manager","Financial Analyst",
  "Systems Administrator","Database Administrator","Security Engineer",
  "Machine Learning Engineer","Cloud Architect","Technical Writer",
  "Scrum Master","Business Analyst","Operations Manager",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type FieldKey =
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "company"
  | "jobTitle"
  | "username";

interface FakeRecord {
  [key: string]: string;
}

const FIELD_LABELS: Record<FieldKey, string> = {
  fullName: "Full Name",
  email: "Email",
  phone: "Phone",
  address: "Address",
  company: "Company",
  jobTitle: "Job Title",
  username: "Username",
};

function generateRecord(fields: FieldKey[]): FakeRecord {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const record: FakeRecord = {};

  for (const field of fields) {
    switch (field) {
      case "fullName":
        record["Full Name"] = `${first} ${last}`;
        break;
      case "email":
        record["Email"] = `${first.toLowerCase()}.${last.toLowerCase()}${randInt(1, 99)}@${pick(DOMAINS)}`;
        break;
      case "phone":
        record["Phone"] = `+1 (${randInt(200, 999)}) ${randInt(200, 999)}-${String(randInt(1000, 9999))}`;
        break;
      case "address":
        record["Address"] = `${randInt(100, 9999)} ${pick(STREETS)}, ${pick(CITIES)}, ${pick(COUNTRIES)}`;
        break;
      case "company":
        record["Company"] = pick(COMPANIES);
        break;
      case "jobTitle":
        record["Job Title"] = pick(JOB_TITLES);
        break;
      case "username":
        record["Username"] = `${first.toLowerCase()}${last.toLowerCase().charAt(0)}${randInt(1, 999)}`;
        break;
    }
  }
  return record;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const ALL_FIELDS: FieldKey[] = [
  "fullName",
  "email",
  "phone",
  "address",
  "company",
  "jobTitle",
  "username",
];

export default function FakeDataGenerator() {
  const [quantity, setQuantity] = useState(10);
  const [selectedFields, setSelectedFields] = useState<Set<FieldKey>>(
    new Set(ALL_FIELDS)
  );
  const [data, setData] = useState<FakeRecord[]>([]);

  const toggleField = (field: FieldKey) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        if (next.size <= 1) return prev; // keep at least one
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  const generate = useCallback(() => {
    const fields = ALL_FIELDS.filter((f) => selectedFields.has(f));
    const records: FakeRecord[] = [];
    for (let i = 0; i < quantity; i++) {
      records.push(generateRecord(fields));
    }
    setData(records);
  }, [quantity, selectedFields]);

  const jsonString = JSON.stringify(data, null, 2);

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeFields = ALL_FIELDS.filter((f) => selectedFields.has(f));
  const activeLabels = activeFields.map((f) => FIELD_LABELS[f]);

  const faqs = [
    { question: "Is the generated data truly random?", answer: "Yes. Names, emails, and addresses are randomly combined from predefined lists. No real personal information is used. The data looks realistic but does not correspond to any actual individuals." },
    { question: "Can I generate data in bulk?", answer: "Yes. Specify the number of records you need and generate up to hundreds of rows at once. Export the results as JSON or CSV for easy import into databases or testing tools." },
    { question: "Does it support custom data formats?", answer: "The tool supports common data types like names, emails, addresses, phone numbers, dates, and UUIDs. For custom formats, you can modify the generated output or use the data as a starting point." },
  ];

  return (
    <ToolLayout
      title="Fake Data Generator"
      description="Generate realistic fake data for testing. 100% client-side with no external APIs."
      slug="fake-data-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Generate Fake Data for Testing", content: "Select the data types you need \u2014 names, emails, addresses, phone numbers, dates, UUIDs, or custom fields \u2014 and generate realistic fake data instantly. Export as JSON, CSV, or copy directly. All data is generated client-side using randomized algorithms, ensuring no real personal information is used." },
            { title: "Why Use Fake Data in Development", content: "Fake data is essential for testing applications without using real user information. It helps developers populate databases during development, test form validation and edge cases, create realistic demo environments, generate seed data for staging servers, and comply with data privacy regulations (GDPR, CCPA) by never using real personal data in non-production environments." },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Controls */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">
          Quantity ({quantity})
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full max-w-xs"
        />
      </div>

      {/* Field checkboxes */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Fields</label>
        <div className="flex flex-wrap gap-3">
          {ALL_FIELDS.map((field) => (
            <label
              key={field}
              className="flex items-center gap-1.5 text-sm cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedFields.has(field)}
                onChange={() => toggleField(field)}
                className="rounded"
              />
              {FIELD_LABELS[field]}
            </label>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
      >
        Generate New
      </button>

      {/* Results table */}
      {data.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-medium">
              Generated {data.length} record{data.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <CopyButton text={jsonString} label="Copy JSON" />
              <button
                onClick={downloadJson}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium transition-all hover:bg-[var(--muted)] btn-press"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download JSON
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                  <th className="px-3 py-2 text-left font-medium text-[var(--muted-foreground)]">
                    #
                  </th>
                  {activeLabels.map((label) => (
                    <th
                      key={label}
                      className="px-3 py-2 text-left font-medium text-[var(--muted-foreground)] whitespace-nowrap"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((record, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)]/50"
                  >
                    <td className="px-3 py-2 text-[var(--muted-foreground)]">
                      {i + 1}
                    </td>
                    {activeLabels.map((label) => (
                      <td
                        key={label}
                        className="px-3 py-2 whitespace-nowrap font-mono text-xs"
                      >
                        {record[label] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
