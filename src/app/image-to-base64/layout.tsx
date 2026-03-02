import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to Base64 Converter Online - Free Tool | DevTools Online",
  description:
    "Convert images to Base64 encoded strings. Get Data URI, raw Base64, HTML img tags, and CSS background-image code. Free online tool.",
  alternates: {
    canonical: "https://toolboxurl.com/image-to-base64",
  },
  openGraph: {
    title: "Image to Base64 Converter Online - Free Online Tool",
    description:
      "Convert images to Base64 encoded strings. Get Data URI, raw Base64, HTML img tags, and CSS background-image code. Free online tool.",
    url: "https://toolboxurl.com/image-to-base64",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
