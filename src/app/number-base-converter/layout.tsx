import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number Base Converter Online - Free Tool | DevTools Online",
  description:
    "Convert numbers between decimal, binary, octal, and hexadecimal bases. Supports large numbers with BigInt. Free online base converter.",
  alternates: {
    canonical: "https://toolboxurl.com/number-base-converter",
  },
  openGraph: {
    title: "Number Base Converter Online - Free Online Tool",
    description:
      "Convert numbers between decimal, binary, octal, and hexadecimal bases. Supports large numbers with BigInt. Free online base converter.",
    url: "https://toolboxurl.com/number-base-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
