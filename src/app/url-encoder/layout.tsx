import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder Online - Free Tool | DevTools Online",
  description:
    "Encode special characters in URLs or decode percent-encoded strings. Free online URL encoding tool.",
  alternates: {
    canonical: "https://toolboxurl.com/url-encoder",
  },
  openGraph: {
    title: "URL Encoder / Decoder Online - Free Online Tool",
    description:
      "Encode special characters in URLs or decode percent-encoded strings. Free online URL encoding tool.",
    url: "https://toolboxurl.com/url-encoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
