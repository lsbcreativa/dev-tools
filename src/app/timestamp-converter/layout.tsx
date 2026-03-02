import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter Online - Free Tool | DevTools Online",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds with UTC, local, and ISO 8601 output.",
  alternates: {
    canonical: "https://toolboxurl.com/timestamp-converter",
  },
  openGraph: {
    title: "Unix Timestamp Converter Online - Free Online Tool",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds with UTC, local, and ISO 8601 output.",
    url: "https://toolboxurl.com/timestamp-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
