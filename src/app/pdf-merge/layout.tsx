import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Merge - Combine PDF Files Free | ToolboxURL",
  description:
    "Merge multiple PDF files into one document. Drag to reorder pages. No upload limits, no signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/pdf-merge",
  },
  openGraph: {
    title: "PDF Merge - Free Online Tool",
    description:
      "Merge multiple PDF files into one document. No upload limits, no signup — 100% client-side.",
    url: "https://toolboxurl.com/pdf-merge",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
