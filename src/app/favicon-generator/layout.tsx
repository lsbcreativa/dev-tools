import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favicon Generator — Create Favicons Online Free | DevTools Online",
  description:
    "Generate favicons from text, emoji or initials. Download as PNG in 16×16, 32×32, 48×48, 64×64, 128×128 and 512×512 sizes. Free, no signup.",
  alternates: {
    canonical: "https://toolboxurl.com/favicon-generator",
  },
  openGraph: {
    title: "Favicon Generator — Create Favicons Online Free | DevTools Online",
    description:
      "Generate favicons from text, emoji or initials. Download as PNG in 16×16, 32×32, 48×48, 64×64, 128×128 and 512×512 sizes. Free, no signup.",
    url: "https://toolboxurl.com/favicon-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
