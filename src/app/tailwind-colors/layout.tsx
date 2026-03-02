import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailwind Color Finder - Free Tool | DevTools Online",
  description:
    "Find the closest Tailwind CSS color to any hex value. See side-by-side comparisons and copy Tailwind class names instantly.",
  alternates: {
    canonical: "https://toolboxurl.com/tailwind-colors",
  },
  openGraph: {
    title: "Tailwind Color Finder - Free Online Tool",
    description:
      "Find the closest Tailwind CSS color to any hex value. See side-by-side comparisons and copy Tailwind class names instantly.",
    url: "https://toolboxurl.com/tailwind-colors",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
