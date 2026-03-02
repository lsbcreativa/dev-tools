import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor - Free Tool | DevTools Online",
  description:
    "Compress and resize images in your browser. Supports JPEG, PNG, and WebP output with adjustable quality. 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/image-compressor",
  },
  openGraph: {
    title: "Image Compressor - Free Online Tool",
    description:
      "Compress and resize images in your browser. Supports JPEG, PNG, and WebP output with adjustable quality. 100% client-side.",
    url: "https://toolboxurl.com/image-compressor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
