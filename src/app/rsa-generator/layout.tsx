import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSA Key Pair Generator - Free Tool | DevTools Online",
  description:
    "Generate RSA key pairs (2048 or 4096 bit) directly in your browser using the Web Crypto API. Keys never leave your device.",
  alternates: {
    canonical: "https://toolboxurl.com/rsa-generator",
  },
  openGraph: {
    title: "RSA Key Pair Generator - Free Online Tool",
    description:
      "Generate RSA key pairs (2048 or 4096 bit) directly in your browser using the Web Crypto API. Keys never leave your device.",
    url: "https://toolboxurl.com/rsa-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
