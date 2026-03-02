import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to YAML Converter Online - Free Tool | DevTools Online",
  description:
    "Convert between JSON and YAML formats instantly. Free online converter tool with syntax validation and error handling.",
  alternates: {
    canonical: "https://toolboxurl.com/json-yaml",
  },
  openGraph: {
    title: "JSON to YAML Converter Online - Free Online Tool",
    description:
      "Convert between JSON and YAML formats instantly. Free online converter tool with syntax validation and error handling.",
    url: "https://toolboxurl.com/json-yaml",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
