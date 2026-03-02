import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTP Headers Inspector & Explainer | DevTools Online",
  description:
    "Paste HTTP response headers and get plain-English explanations. Understand Cache-Control, CORS, security headers and more. Free HTTP headers reference.",
  alternates: {
    canonical: "https://toolboxurl.com/http-headers",
  },
  openGraph: {
    title: "HTTP Headers Inspector & Explainer | DevTools Online",
    description:
      "Paste HTTP response headers and get plain-English explanations. Understand Cache-Control, CORS, security headers and more. Free HTTP headers reference.",
    url: "https://toolboxurl.com/http-headers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
