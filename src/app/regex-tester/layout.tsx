import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester Online - Free Regular Expression Tool | DevTools Online",
  description:
    "Test regular expressions in real-time with match highlighting and capture groups. Free online regex tester.",
  alternates: {
    canonical: "https://toolboxurl.com/regex-tester",
  },
  openGraph: {
    title: "Regex Tester Online - Free Regular Expression Tool - Free Online Tool",
    description:
      "Test regular expressions in real-time with match highlighting and capture groups. Free online regex tester.",
    url: "https://toolboxurl.com/regex-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
