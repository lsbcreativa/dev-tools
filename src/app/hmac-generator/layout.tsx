import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HMAC Generator - Free Tool | DevTools Online",
  description:
    "Generate HMAC signatures using SHA-256, SHA-384, and SHA-512 with the Web Crypto API. Your data never leaves your browser.",
  alternates: {
    canonical: "https://toolboxurl.com/hmac-generator",
  },
  openGraph: {
    title: "HMAC Generator - Free Online Tool",
    description:
      "Generate HMAC signatures using SHA-256, SHA-384, and SHA-512 with the Web Crypto API. Your data never leaves your browser.",
    url: "https://toolboxurl.com/hmac-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
