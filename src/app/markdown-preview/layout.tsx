import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview Online - Free Tool | DevTools Online",
  description:
    "Live markdown editor and preview. Write markdown and see the rendered HTML output in real time.",
  alternates: {
    canonical: "https://toolboxurl.com/markdown-preview",
  },
  openGraph: {
    title: "Markdown Preview Online - Free Online Tool",
    description:
      "Live markdown editor and preview. Write markdown and see the rendered HTML output in real time.",
    url: "https://toolboxurl.com/markdown-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
