import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Contrast Checker - Free Tool | DevTools Online",
  description:
    "Check WCAG 2.0 color contrast ratios between foreground and background colors. Verify AA and AAA compliance for accessibility.",
  alternates: {
    canonical: "https://toolboxurl.com/contrast-checker",
  },
  openGraph: {
    title: "Color Contrast Checker - Free Online Tool",
    description:
      "Check WCAG 2.0 color contrast ratios between foreground and background colors. Verify AA and AAA compliance for accessibility.",
    url: "https://toolboxurl.com/contrast-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
