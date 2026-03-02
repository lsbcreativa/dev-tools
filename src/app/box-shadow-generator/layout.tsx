import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator Online - Free Tool | DevTools Online",
  description:
    "Generate CSS box-shadow values with a visual editor. Customize multiple shadow layers, preview live, and copy the CSS. Free online tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/box-shadow-generator",
  },
  openGraph: {
    title: "CSS Box Shadow Generator Online - Free Online Tool",
    description:
      "Generate CSS box-shadow values with a visual editor. Customize multiple shadow layers, preview live, and copy the CSS. Free online tool.",
    url: "https://devtoolsonline.com/box-shadow-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
