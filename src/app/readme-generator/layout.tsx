import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub README Generator - Free Tool | DevTools Online",
  description:
    "Generate professional GitHub README.md files with badges, installation instructions, features, and more. Preview rendered markdown and copy the output.",
  alternates: {
    canonical: "https://devtoolsonline.com/readme-generator",
  },
  openGraph: {
    title: "GitHub README Generator - Free Online Tool",
    description:
      "Generate professional GitHub README.md files with badges, installation instructions, features, and more. Preview rendered markdown and copy the output.",
    url: "https://devtoolsonline.com/readme-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
