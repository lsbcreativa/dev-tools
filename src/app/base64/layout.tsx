import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder Online - Free Tool | DevTools Online",
  description:
    "Encode text to Base64 or decode Base64 strings back to plain text. Free online Base64 tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/base64",
  },
  openGraph: {
    title: "Base64 Encoder / Decoder Online - Free Online Tool",
    description:
      "Encode text to Base64 or decode Base64 strings back to plain text. Free online Base64 tool.",
    url: "https://devtoolsonline.com/base64",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
