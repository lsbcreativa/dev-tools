import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entity Encoder / Decoder - Free Tool | DevTools Online",
  description:
    "Convert special characters to HTML entities and vice versa. Free online HTML entity encoder and decoder.",
  alternates: {
    canonical: "https://devtoolsonline.com/html-entities",
  },
  openGraph: {
    title: "HTML Entity Encoder / Decoder - Free Online Tool",
    description:
      "Convert special characters to HTML entities and vice versa. Free online HTML entity encoder and decoder.",
    url: "https://devtoolsonline.com/html-entities",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
