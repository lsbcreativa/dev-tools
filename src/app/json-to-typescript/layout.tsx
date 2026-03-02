import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to TypeScript - Free Tool | DevTools Online",
  description:
    "Convert JSON data to TypeScript interfaces and type aliases. Handles nested objects, arrays, and optional fields automatically.",
  alternates: {
    canonical: "https://devtoolsonline.com/json-to-typescript",
  },
  openGraph: {
    title: "JSON to TypeScript - Free Online Tool",
    description:
      "Convert JSON data to TypeScript interfaces and type aliases. Handles nested objects, arrays, and optional fields automatically.",
    url: "https://devtoolsonline.com/json-to-typescript",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
