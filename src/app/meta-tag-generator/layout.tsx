import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tag Generator Online - Free Tool | DevTools Online",
  description:
    "Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page appears in Google search results. Free online tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/meta-tag-generator",
  },
  openGraph: {
    title: "Meta Tag Generator Online - Free Online Tool",
    description:
      "Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page appears in Google search results. Free online tool.",
    url: "https://devtoolsonline.com/meta-tag-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
