import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator - Free Tool | DevTools Online",
  description:
    "Calculate and convert aspect ratios, resize dimensions proportionally, and get CSS aspect-ratio properties. Free online aspect ratio tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/aspect-ratio",
  },
  openGraph: {
    title: "Aspect Ratio Calculator - Free Online Tool",
    description:
      "Calculate and convert aspect ratios, resize dimensions proportionally, and get CSS aspect-ratio properties. Free online aspect ratio tool.",
    url: "https://devtoolsonline.com/aspect-ratio",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
