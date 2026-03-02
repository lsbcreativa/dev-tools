import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTP Status Codes Reference - Free Tool | DevTools Online",
  description:
    "Complete HTTP status codes reference with descriptions, use cases, and search. Covers 1xx through 5xx codes.",
  alternates: {
    canonical: "https://toolboxurl.com/http-status-codes",
  },
  openGraph: {
    title: "HTTP Status Codes Reference - Free Online Tool",
    description:
      "Complete HTTP status codes reference with descriptions, use cases, and search. Covers 1xx through 5xx codes.",
    url: "https://toolboxurl.com/http-status-codes",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
