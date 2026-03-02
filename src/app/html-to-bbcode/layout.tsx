import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML to BBCode Converter - Free Tool | DevTools Online",
  description:
    "Convert HTML markup to BBCode format for forums and message boards. Supports bold, italic, links, images, lists, and more.",
  alternates: {
    canonical: "https://devtoolsonline.com/html-to-bbcode",
  },
  openGraph: {
    title: "HTML to BBCode Converter - Free Online Tool",
    description:
      "Convert HTML markup to BBCode format for forums and message boards. Supports bold, italic, links, images, lists, and more.",
    url: "https://devtoolsonline.com/html-to-bbcode",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
