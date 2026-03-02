import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Free Placeholder Text | DevTools Online",
  description:
    "Generate lorem ipsum placeholder text for your designs. Choose paragraphs, sentences, or words. Free online tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/lorem-ipsum-generator",
  },
  openGraph: {
    title: "Lorem Ipsum Generator - Free Placeholder Text - Free Online Tool",
    description:
      "Generate lorem ipsum placeholder text for your designs. Choose paragraphs, sentences, or words. Free online tool.",
    url: "https://devtoolsonline.com/lorem-ipsum-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
