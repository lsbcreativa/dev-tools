import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML to JSON Converter Online Free | DevTools Online",
  description:
    "Convert YAML to JSON instantly. Supports nested objects, arrays, anchors and multi-line strings. Free online YAML to JSON converter.",
  alternates: {
    canonical: "https://toolboxurl.com/yaml-to-json",
  },
  openGraph: {
    title: "YAML to JSON Converter Online Free | DevTools Online",
    description:
      "Convert YAML to JSON instantly. Supports nested objects, arrays, anchors and multi-line strings. Free online YAML to JSON converter.",
    url: "https://toolboxurl.com/yaml-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
