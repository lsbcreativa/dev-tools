import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Diff Viewer - Compare Code Free | ToolboxURL",
  description:
    "Compare two code snippets side by side with syntax highlighting. Supports all languages. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/code-diff",
  },
  openGraph: {
    title: "Code Diff Viewer - Free Online Tool",
    description:
      "Compare two code snippets side by side with syntax highlighting. Supports all languages. No signup — 100% client-side.",
    url: "https://toolboxurl.com/code-diff",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
