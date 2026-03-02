import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML to JSX - Free Tool | DevTools Online",
  description:
    "Convert HTML markup to valid JSX. Transforms class to className, style strings to objects, self-closes void elements, and more.",
  alternates: {
    canonical: "https://devtoolsonline.com/html-to-jsx",
  },
  openGraph: {
    title: "HTML to JSX - Free Online Tool",
    description:
      "Convert HTML markup to valid JSX. Transforms class to className, style strings to objects, self-closes void elements, and more.",
    url: "https://devtoolsonline.com/html-to-jsx",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
