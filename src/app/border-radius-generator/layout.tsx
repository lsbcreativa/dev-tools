import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator Online - Free Tool | DevTools Online",
  description:
    "Generate CSS border-radius values with a visual editor. Customize each corner independently, preview live, and copy the CSS. Free online tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/border-radius-generator",
  },
  openGraph: {
    title: "CSS Border Radius Generator Online - Free Online Tool",
    description:
      "Generate CSS border-radius values with a visual editor. Customize each corner independently, preview live, and copy the CSS. Free online tool.",
    url: "https://devtoolsonline.com/border-radius-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
