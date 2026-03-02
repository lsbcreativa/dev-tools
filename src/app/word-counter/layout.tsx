import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word & Character Counter Online - Free Tool | DevTools Online",
  description:
    "Count words, characters, sentences, paragraphs and estimate reading time instantly. Free online word counter tool.",
  alternates: {
    canonical: "https://toolboxurl.com/word-counter",
  },
  openGraph: {
    title: "Word & Character Counter Online - Free Online Tool",
    description:
      "Count words, characters, sentences, paragraphs and estimate reading time instantly. Free online word counter tool.",
    url: "https://toolboxurl.com/word-counter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
