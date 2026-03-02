import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Formatter & Validator - Free Tool | DevTools Online",
  description:
    "Beautify, minify, and validate XML documents online. Format XML with proper indentation or compress it for production use.",
  alternates: {
    canonical: "https://devtoolsonline.com/xml-formatter",
  },
  openGraph: {
    title: "XML Formatter & Validator - Free Online Tool",
    description:
      "Beautify, minify, and validate XML documents online. Format XML with proper indentation or compress it for production use.",
    url: "https://devtoolsonline.com/xml-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
