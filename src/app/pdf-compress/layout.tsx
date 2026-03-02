import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Compress - Reduce PDF Size Free | ToolboxURL",
  description:
    "Compress PDF files by removing metadata and optimizing structure. No upload limits, no signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/pdf-compress",
  },
  openGraph: {
    title: "PDF Compress - Free Online Tool",
    description:
      "Compress PDF files by removing metadata and optimizing structure. No upload limits, no signup — 100% client-side.",
    url: "https://toolboxurl.com/pdf-compress",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
