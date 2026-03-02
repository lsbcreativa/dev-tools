import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator - Generate UUID v4 Online | DevTools Online",
  description:
    "Generate random UUID v4 identifiers. Bulk generate multiple UUIDs with one click. Free online UUID generator.",
  alternates: {
    canonical: "https://toolboxurl.com/uuid-generator",
  },
  openGraph: {
    title: "UUID Generator - Generate UUID v4 Online - Free Online Tool",
    description:
      "Generate random UUID v4 identifiers. Bulk generate multiple UUIDs with one click. Free online UUID generator.",
    url: "https://toolboxurl.com/uuid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
