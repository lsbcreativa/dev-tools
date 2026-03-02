import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Variables Generator — Design Tokens Builder | DevTools Online",
  description:
    "Define design tokens — colors, spacing, typography, shadows — and generate a :root CSS variables block. Export your design system tokens as CSS custom properties.",
  alternates: {
    canonical: "https://toolboxurl.com/css-variables",
  },
  openGraph: {
    title: "CSS Variables Generator — Design Tokens Builder | DevTools Online",
    description:
      "Define design tokens — colors, spacing, typography, shadows — and generate a :root CSS variables block. Export your design system tokens as CSS custom properties.",
    url: "https://toolboxurl.com/css-variables",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
