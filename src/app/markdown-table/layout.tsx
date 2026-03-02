import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Table Generator - Free Tool | DevTools Online",
  description:
    "Generate formatted Markdown tables with a visual editor. Supports column alignment, CSV import, and live preview.",
  alternates: {
    canonical: "https://toolboxurl.com/markdown-table",
  },
  openGraph: {
    title: "Markdown Table Generator - Free Online Tool",
    description:
      "Generate formatted Markdown tables with a visual editor. Supports column alignment, CSV import, and live preview.",
    url: "https://toolboxurl.com/markdown-table",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
