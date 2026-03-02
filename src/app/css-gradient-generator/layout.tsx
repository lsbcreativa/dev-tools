import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Gradient Generator - Create Gradients Online | DevTools Online",
  description:
    "Create beautiful CSS gradients with a visual editor. Copy the CSS code. Free online gradient generator.",
  alternates: {
    canonical: "https://devtoolsonline.com/css-gradient-generator",
  },
  openGraph: {
    title: "CSS Gradient Generator - Create Gradients Online - Free Online Tool",
    description:
      "Create beautiful CSS gradients with a visual editor. Copy the CSS code. Free online gradient generator.",
    url: "https://devtoolsonline.com/css-gradient-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
