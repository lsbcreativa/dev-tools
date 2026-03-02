import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator - SHA-256, SHA-1, SHA-512 Online | DevTools Online",
  description:
    "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. Free online hash generator.",
  alternates: {
    canonical: "https://toolboxurl.com/hash-generator",
  },
  openGraph: {
    title: "Hash Generator - SHA-256, SHA-1, SHA-512 Online - Free Online Tool",
    description:
      "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. Free online hash generator.",
    url: "https://toolboxurl.com/hash-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
