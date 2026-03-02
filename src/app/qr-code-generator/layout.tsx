import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator - Create QR Codes Online Free | DevTools Online",
  description:
    "Generate QR codes from any text or URL. Download as PNG. Free online QR code generator.",
  alternates: {
    canonical: "https://toolboxurl.com/qr-code-generator",
  },
  openGraph: {
    title: "QR Code Generator - Create QR Codes Online Free - Free Online Tool",
    description:
      "Generate QR codes from any text or URL. Download as PNG. Free online QR code generator.",
    url: "https://toolboxurl.com/qr-code-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
