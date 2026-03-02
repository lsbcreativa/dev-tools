import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Preview & Optimizer Online - Free Tool | DevTools Online",
  description:
    "Preview and optimize SVG code. Remove comments, metadata, and unnecessary whitespace. See size reduction stats and download optimized SVG. Free online tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/svg-preview",
  },
  openGraph: {
    title: "SVG Preview & Optimizer Online - Free Online Tool",
    description:
      "Preview and optimize SVG code. Remove comments, metadata, and unnecessary whitespace. See size reduction stats and download optimized SVG. Free online tool.",
    url: "https://devtoolsonline.com/svg-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
