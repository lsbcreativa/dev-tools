import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encoding Playground - Free Tool | DevTools Online",
  description:
    "Chain multiple encoding and decoding operations together. Supports Base64, URL, Hex, ROT13, HTML Entities, and more.",
  alternates: {
    canonical: "https://toolboxurl.com/encoding-playground",
  },
  openGraph: {
    title: "Encoding Playground - Free Online Tool",
    description:
      "Chain multiple encoding and decoding operations together. Supports Base64, URL, Hex, ROT13, HTML Entities, and more.",
    url: "https://toolboxurl.com/encoding-playground",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
