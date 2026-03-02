import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Palette Generator Online - Free Tool | DevTools Online",
  description:
    "Generate color palettes from any base color. Create complementary, analogous, triadic, split-complementary, and monochromatic schemes. Free online tool.",
  alternates: {
    canonical: "https://toolboxurl.com/color-palette-generator",
  },
  openGraph: {
    title: "Color Palette Generator Online - Free Online Tool",
    description:
      "Generate color palettes from any base color. Create complementary, analogous, triadic, split-complementary, and monochromatic schemes. Free online tool.",
    url: "https://toolboxurl.com/color-palette-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
