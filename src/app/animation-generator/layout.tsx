import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Animation Generator - Free Tool | DevTools Online",
  description:
    "Create CSS keyframe animations visually. Edit keyframes, preview live, use presets, and copy the generated CSS code.",
  alternates: {
    canonical: "https://toolboxurl.com/animation-generator",
  },
  openGraph: {
    title: "CSS Animation Generator - Free Online Tool",
    description:
      "Create CSS keyframe animations visually. Edit keyframes, preview live, use presets, and copy the generated CSS code.",
    url: "https://toolboxurl.com/animation-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
