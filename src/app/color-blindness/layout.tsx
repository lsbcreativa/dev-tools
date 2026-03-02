import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Blindness Simulator — Test Design Accessibility | DevTools Online",
  description:
    "Simulate how your designs look to users with color blindness. Upload an image or enter a URL and preview all 4 types: Protanopia, Deuteranopia, Tritanopia, Achromatopsia.",
  alternates: {
    canonical: "https://toolboxurl.com/color-blindness",
  },
  openGraph: {
    title: "Color Blindness Simulator — Test Design Accessibility | DevTools Online",
    description:
      "Simulate how your designs look to users with color blindness. Upload an image or enter a URL and preview all 4 types: Protanopia, Deuteranopia, Tritanopia, Achromatopsia.",
    url: "https://toolboxurl.com/color-blindness",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
