import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to SQL Converter — Generate INSERT Statements | DevTools Online",
  description:
    "Convert JSON arrays to SQL CREATE TABLE and INSERT statements. Supports MySQL, PostgreSQL and SQLite syntax. Free online JSON to SQL generator.",
  alternates: {
    canonical: "https://toolboxurl.com/json-to-sql",
  },
  openGraph: {
    title: "JSON to SQL Converter — Generate INSERT Statements | DevTools Online",
    description:
      "Convert JSON arrays to SQL CREATE TABLE and INSERT statements. Supports MySQL, PostgreSQL and SQLite syntax. Free online JSON to SQL generator.",
    url: "https://toolboxurl.com/json-to-sql",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
