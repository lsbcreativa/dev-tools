import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Minifier / Beautifier - Free Tool | DevTools Online",
  description:
    "Minify CSS for production or beautify compressed CSS for readability. Supports media queries, nested rules, and provides size statistics.",
  alternates: {
    canonical: "https://toolboxurl.com/css-minifier",
  },
  openGraph: {
    title: "CSS Minifier / Beautifier - Free Online Tool",
    description:
      "Minify CSS for production or beautify compressed CSS for readability. Supports media queries, nested rules, and provides size statistics.",
    url: "https://toolboxurl.com/css-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
