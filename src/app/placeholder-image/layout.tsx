import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placeholder Image Generator Online - Free Tool | DevTools Online",
  description:
    "Generate placeholder images with custom dimensions, colors, and text using the Canvas API. Download as PNG. Free online tool.",
  alternates: {
    canonical: "https://toolboxurl.com/placeholder-image",
  },
  openGraph: {
    title: "Placeholder Image Generator Online - Free Online Tool",
    description:
      "Generate placeholder images with custom dimensions, colors, and text using the Canvas API. Download as PNG. Free online tool.",
    url: "https://toolboxurl.com/placeholder-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
