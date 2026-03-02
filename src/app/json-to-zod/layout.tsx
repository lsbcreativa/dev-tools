import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to Zod Schema Generator - Free Online | ToolboxURL",
  description:
    "Generate Zod validation schemas from JSON data automatically. Supports nested objects, arrays, and optional fields. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/json-to-zod",
  },
  openGraph: {
    title: "JSON to Zod Schema Generator - Free Online Tool",
    description:
      "Generate Zod validation schemas from JSON data automatically. Supports nested objects, arrays, and optional fields. No signup — 100% client-side.",
    url: "https://toolboxurl.com/json-to-zod",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
