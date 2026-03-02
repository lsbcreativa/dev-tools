import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Explainer - Free Tool | DevTools Online",
  description:
    "Paste a regular expression and get a plain-English explanation of every part. Test your regex against sample text with match highlighting.",
  alternates: {
    canonical: "https://devtoolsonline.com/regex-explainer",
  },
  openGraph: {
    title: "Regex Explainer - Free Online Tool",
    description:
      "Paste a regular expression and get a plain-English explanation of every part. Test your regex against sample text with match highlighting.",
    url: "https://devtoolsonline.com/regex-explainer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
