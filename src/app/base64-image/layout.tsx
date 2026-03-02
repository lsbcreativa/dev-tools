import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Image Viewer & Decoder Online | DevTools Online",
  description:
    "Paste a Base64 image string and preview it instantly in your browser. Detect image format, dimensions and file size. Free, 100% private.",
  alternates: {
    canonical: "https://toolboxurl.com/base64-image",
  },
  openGraph: {
    title: "Base64 Image Viewer & Decoder Online | DevTools Online",
    description:
      "Paste a Base64 image string and preview it instantly in your browser. Detect image format, dimensions and file size. Free, 100% private.",
    url: "https://toolboxurl.com/base64-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
