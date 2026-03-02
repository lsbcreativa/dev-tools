import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON/CSV to Excel - Free Converter | ToolboxURL",
  description:
    "Convert JSON or CSV data to a real .xlsx Excel file. No signup, no limits — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/json-to-excel",
  },
  openGraph: {
    title: "JSON/CSV to Excel Converter - Free Online Tool",
    description:
      "Convert JSON or CSV data to a real .xlsx Excel file. No signup, no limits — 100% client-side.",
    url: "https://toolboxurl.com/json-to-excel",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
