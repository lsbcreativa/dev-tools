import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Background Remover - Free AI Tool | ToolboxURL",
  description:
    "Remove image backgrounds automatically using AI. Download transparent PNG. No signup, no limits — runs entirely in your browser.",
  alternates: {
    canonical: "https://toolboxurl.com/bg-remover",
  },
  openGraph: {
    title: "Image Background Remover - Free AI Tool",
    description:
      "Remove image backgrounds automatically using AI. Download transparent PNG. No signup, no limits — runs entirely in your browser.",
    url: "https://toolboxurl.com/bg-remover",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
