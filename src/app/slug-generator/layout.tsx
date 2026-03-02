import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slug Generator Online - Free URL Slug Tool | DevTools Online",
  description:
    "Generate clean URL slugs from any text. Supports custom separators, accent removal, and special character handling. Free online slug generator.",
  alternates: {
    canonical: "https://toolboxurl.com/slug-generator",
  },
  openGraph: {
    title: "Slug Generator Online - Free URL Slug Tool - Free Online Tool",
    description:
      "Generate clean URL slugs from any text. Supports custom separators, accent removal, and special character handling. Free online slug generator.",
    url: "https://toolboxurl.com/slug-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
