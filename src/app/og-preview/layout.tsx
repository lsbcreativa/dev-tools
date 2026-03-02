import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Graph Preview - Free Tool | DevTools Online",
  description:
    "Preview how your website will look when shared on Twitter, Facebook, and LinkedIn. Generate Open Graph and Twitter Card meta tags.",
  alternates: {
    canonical: "https://devtoolsonline.com/og-preview",
  },
  openGraph: {
    title: "Open Graph Preview - Free Online Tool",
    description:
      "Preview how your website will look when shared on Twitter, Facebook, and LinkedIn. Generate Open Graph and Twitter Card meta tags.",
    url: "https://devtoolsonline.com/og-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
