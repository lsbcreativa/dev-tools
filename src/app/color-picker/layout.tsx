import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Picker & Converter - HEX RGB HSL | DevTools Online",
  description:
    "Pick colors and convert between HEX, RGB, and HSL formats. Copy CSS values. Free online color picker.",
  alternates: {
    canonical: "https://devtoolsonline.com/color-picker",
  },
  openGraph: {
    title: "Color Picker & Converter - HEX RGB HSL - Free Online Tool",
    description:
      "Pick colors and convert between HEX, RGB, and HSL formats. Copy CSS values. Free online color picker.",
    url: "https://devtoolsonline.com/color-picker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
