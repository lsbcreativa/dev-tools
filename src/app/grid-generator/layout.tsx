import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Grid Generator - Free Tool | DevTools Online",
  description:
    "Build CSS Grid layouts visually. Configure columns, rows, gap, alignment, add items, use presets, and copy the generated CSS.",
  alternates: {
    canonical: "https://devtoolsonline.com/grid-generator",
  },
  openGraph: {
    title: "CSS Grid Generator - Free Online Tool",
    description:
      "Build CSS Grid layouts visually. Configure columns, rows, gap, alignment, add items, use presets, and copy the generated CSS.",
    url: "https://devtoolsonline.com/grid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
