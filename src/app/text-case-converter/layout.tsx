import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Case Converter Online - Free Tool | DevTools Online",
  description:
    "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more. Free online text case converter.",
  alternates: {
    canonical: "https://toolboxurl.com/text-case-converter",
  },
  openGraph: {
    title: "Text Case Converter Online - Free Online Tool",
    description:
      "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more. Free online text case converter.",
    url: "https://toolboxurl.com/text-case-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
