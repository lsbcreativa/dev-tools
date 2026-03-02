import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fluid Typography Calculator - Free Tool | DevTools Online",
  description:
    "Calculate CSS clamp() values for fluid responsive typography. Generate font sizes for headings and body text that scale smoothly between viewports.",
  alternates: {
    canonical: "https://devtoolsonline.com/fluid-typography",
  },
  openGraph: {
    title: "Fluid Typography Calculator - Free Online Tool",
    description:
      "Calculate CSS clamp() values for fluid responsive typography. Generate font sizes for headings and body text that scale smoothly between viewports.",
    url: "https://devtoolsonline.com/fluid-typography",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
