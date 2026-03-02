import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff Checker - Compare Text Online Free | DevTools Online",
  description:
    "Compare two texts side by side and highlight differences. Free online text diff and comparison tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/text-diff",
  },
  openGraph: {
    title: "Text Diff Checker - Compare Text Online Free - Free Online Tool",
    description:
      "Compare two texts side by side and highlight differences. Free online text diff and comparison tool.",
    url: "https://devtoolsonline.com/text-diff",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
