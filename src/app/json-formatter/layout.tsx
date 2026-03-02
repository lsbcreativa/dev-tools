import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online - Free Tool | DevTools Online",
  description:
    "Format, validate, and minify JSON data with proper indentation. Free online JSON beautifier and validator.",
  alternates: {
    canonical: "https://toolboxurl.com/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator Online - Free Online Tool",
    description:
      "Format, validate, and minify JSON data with proper indentation. Free online JSON beautifier and validator.",
    url: "https://toolboxurl.com/json-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
