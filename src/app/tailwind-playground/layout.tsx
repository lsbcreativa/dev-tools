import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailwind CSS Playground - Live Preview Free | ToolboxURL",
  description:
    "Preview Tailwind CSS classes in real-time. See rendered output and generated CSS instantly. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/tailwind-playground",
  },
  openGraph: {
    title: "Tailwind CSS Playground - Free Online Tool",
    description:
      "Preview Tailwind CSS classes in real-time. See rendered output and generated CSS instantly. No signup — 100% client-side.",
    url: "https://toolboxurl.com/tailwind-playground",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
