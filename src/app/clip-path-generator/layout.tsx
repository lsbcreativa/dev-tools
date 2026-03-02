import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Clip-path Generator — Create Shapes Online | DevTools Online",
  description:
    "Generate CSS clip-path shapes visually. Create polygons, circles, ellipses with live preview. Copy the CSS code instantly. Free online clip-path generator.",
  alternates: {
    canonical: "https://toolboxurl.com/clip-path-generator",
  },
  openGraph: {
    title: "CSS Clip-path Generator — Create Shapes Online | DevTools Online",
    description:
      "Generate CSS clip-path shapes visually. Create polygons, circles, ellipses with live preview. Copy the CSS code instantly. Free online clip-path generator.",
    url: "https://toolboxurl.com/clip-path-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
