import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Binary to Text Converter Online | DevTools Online",
  description:
    "Convert binary code (0s and 1s) to readable text and text back to binary. Supports ASCII and UTF-8 encoding. Free binary translator.",
  alternates: {
    canonical: "https://toolboxurl.com/binary-to-text",
  },
  openGraph: {
    title: "Binary to Text Converter Online | DevTools Online",
    description:
      "Convert binary code (0s and 1s) to readable text and text back to binary. Supports ASCII and UTF-8 encoding. Free binary translator.",
    url: "https://toolboxurl.com/binary-to-text",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
