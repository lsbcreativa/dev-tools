import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Split - Extract Pages Free | ToolboxURL",
  description:
    "Split PDF files and extract specific pages or page ranges. No upload limits, no signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/pdf-split",
  },
  openGraph: {
    title: "PDF Split - Free Online Tool",
    description:
      "Split PDF files and extract specific pages or page ranges. No upload limits, no signup — 100% client-side.",
    url: "https://toolboxurl.com/pdf-split",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
