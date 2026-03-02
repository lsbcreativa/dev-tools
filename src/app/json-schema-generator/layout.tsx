import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Schema Generator - Free Tool | DevTools Online",
  description:
    "Generate JSON Schema Draft 7 from any JSON data. Auto-detects types, formats, required fields, and nested structures.",
  alternates: {
    canonical: "https://devtoolsonline.com/json-schema-generator",
  },
  openGraph: {
    title: "JSON Schema Generator - Free Online Tool",
    description:
      "Generate JSON Schema Draft 7 from any JSON data. Auto-detects types, formats, required fields, and nested structures.",
    url: "https://devtoolsonline.com/json-schema-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
