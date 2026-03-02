import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JavaScript Formatter & Minifier Online - Free Tool | DevTools Online",
  description:
    "Beautify and minify JavaScript code with proper indentation. Free online JS formatter and minifier.",
  alternates: {
    canonical: "https://toolboxurl.com/js-formatter",
  },
  openGraph: {
    title: "JavaScript Formatter & Minifier Online - Free Online Tool",
    description:
      "Beautify and minify JavaScript code with proper indentation. Free online JS formatter and minifier.",
    url: "https://toolboxurl.com/js-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
