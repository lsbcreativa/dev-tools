import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to Binary Converter Online - Free Tool | DevTools Online",
  description:
    "Convert text to binary, hexadecimal, octal, or decimal representations and back. Free online encoding tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/text-to-binary",
  },
  openGraph: {
    title: "Text to Binary Converter Online - Free Online Tool",
    description:
      "Convert text to binary, hexadecimal, octal, or decimal representations and back. Free online encoding tool.",
    url: "https://devtoolsonline.com/text-to-binary",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
