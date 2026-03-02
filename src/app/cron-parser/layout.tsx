import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Expression Parser Online - Free Tool | DevTools Online",
  description:
    "Parse and explain cron expressions with human-readable descriptions and next execution times. Free online cron parser.",
  alternates: {
    canonical: "https://toolboxurl.com/cron-parser",
  },
  openGraph: {
    title: "Cron Expression Parser Online - Free Online Tool",
    description:
      "Parse and explain cron expressions with human-readable descriptions and next execution times. Free online cron parser.",
    url: "https://toolboxurl.com/cron-parser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
