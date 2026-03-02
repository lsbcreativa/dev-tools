import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter Online | DevTools Online",
  description:
    "Convert Markdown to raw HTML source code. See the generated tags, copy the HTML output or download it. Free online Markdown to HTML converter.",
  alternates: {
    canonical: "https://toolboxurl.com/markdown-to-html",
  },
  openGraph: {
    title: "Markdown to HTML Converter Online | DevTools Online",
    description:
      "Convert Markdown to raw HTML source code. See the generated tags, copy the HTML output or download it. Free online Markdown to HTML converter.",
    url: "https://toolboxurl.com/markdown-to-html",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
