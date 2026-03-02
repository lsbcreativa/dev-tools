import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TypeScript to JavaScript Converter - Free Tool | DevTools Online",
  description:
    "Convert TypeScript code to plain JavaScript by stripping type annotations, interfaces, generics, and other TS-specific syntax.",
  alternates: {
    canonical: "https://devtoolsonline.com/ts-to-js",
  },
  openGraph: {
    title: "TypeScript to JavaScript Converter - Free Online Tool",
    description:
      "Convert TypeScript code to plain JavaScript by stripping type annotations, interfaces, generics, and other TS-specific syntax.",
    url: "https://devtoolsonline.com/ts-to-js",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
