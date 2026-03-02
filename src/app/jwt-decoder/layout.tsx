import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder Online - Free Token Inspector | DevTools Online",
  description:
    "Decode and inspect JSON Web Tokens (JWT). View header, payload, expiration status, and claims. Free online JWT decoder tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/jwt-decoder",
  },
  openGraph: {
    title: "JWT Decoder Online - Free Token Inspector - Free Online Tool",
    description:
      "Decode and inspect JSON Web Tokens (JWT). View header, payload, expiration status, and claims. Free online JWT decoder tool.",
    url: "https://devtoolsonline.com/jwt-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
