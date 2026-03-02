import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Formatter & Minifier Online - Free Tool | DevTools Online",
  description:
    "Format, beautify, and minify SQL queries with proper indentation and keyword uppercasing. Free online SQL formatter.",
  alternates: {
    canonical: "https://toolboxurl.com/sql-formatter",
  },
  openGraph: {
    title: "SQL Formatter & Minifier Online - Free Online Tool",
    description:
      "Format, beautify, and minify SQL queries with proper indentation and keyword uppercasing. Free online SQL formatter.",
    url: "https://toolboxurl.com/sql-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
