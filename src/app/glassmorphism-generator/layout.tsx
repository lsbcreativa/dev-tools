import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glassmorphism Generator - Free Tool | DevTools Online",
  description:
    "Generate glassmorphism CSS effects with a visual editor. Customize blur, transparency, border, and border-radius. Preview live and copy the CSS.",
  alternates: {
    canonical: "https://devtoolsonline.com/glassmorphism-generator",
  },
  openGraph: {
    title: "Glassmorphism Generator - Free Online Tool",
    description:
      "Generate glassmorphism CSS effects with a visual editor. Customize blur, transparency, border, and border-radius. Preview live and copy the CSS.",
    url: "https://devtoolsonline.com/glassmorphism-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
