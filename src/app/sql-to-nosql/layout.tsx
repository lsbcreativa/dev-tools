import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL to MongoDB Converter - Free Online | ToolboxURL",
  description:
    "Convert SQL queries to MongoDB equivalents. SELECT, INSERT, UPDATE, DELETE to find, insertOne, updateOne, deleteOne. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/sql-to-nosql",
  },
  openGraph: {
    title: "SQL to MongoDB Converter - Free Online Tool",
    description:
      "Convert SQL queries to MongoDB equivalents. SELECT, INSERT, UPDATE, DELETE to find, insertOne, updateOne, deleteOne. No signup — 100% client-side.",
    url: "https://toolboxurl.com/sql-to-nosql",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
