import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Flexbox Generator Online - Free Tool | DevTools Online",
  description:
    "Build CSS flexbox layouts visually. Configure container and item properties, preview live, and copy the generated CSS. Free online flexbox playground.",
  alternates: {
    canonical: "https://toolboxurl.com/flexbox-generator",
  },
  openGraph: {
    title: "CSS Flexbox Generator Online - Free Online Tool",
    description:
      "Build CSS flexbox layouts visually. Configure container and item properties, preview live, and copy the generated CSS. Free online flexbox playground.",
    url: "https://toolboxurl.com/flexbox-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
