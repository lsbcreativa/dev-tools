import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON Converter Online | DevTools Online",
  description:
    "Convert CSV to JSON arrays online. Auto-detects headers, handles quoted fields and type inference. Free, no upload required.",
  alternates: {
    canonical: "https://toolboxurl.com/csv-to-json",
  },
  openGraph: {
    title: "CSV to JSON Converter Online | DevTools Online",
    description:
      "Convert CSV to JSON arrays online. Auto-detects headers, handles quoted fields and type inference. Free, no upload required.",
    url: "https://toolboxurl.com/csv-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
