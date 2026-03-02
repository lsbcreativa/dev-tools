import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to CSV Converter Online - Free Tool | DevTools Online",
  description:
    "Convert JSON arrays to CSV and CSV data back to JSON. Download results as .csv or .json files. Free online converter tool.",
  alternates: {
    canonical: "https://toolboxurl.com/json-csv",
  },
  openGraph: {
    title: "JSON to CSV Converter Online - Free Online Tool",
    description:
      "Convert JSON arrays to CSV and CSV data back to JSON. Download results as .csv or .json files. Free online converter tool.",
    url: "https://toolboxurl.com/json-csv",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
