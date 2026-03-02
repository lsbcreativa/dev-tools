import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Developer Guides & Tutorials",
    template: "%s | DevTools Online Blog",
  },
  description:
    "Free developer guides covering Base64, JWT, JSON, regex, URL encoding, password hashing, and more. Practical tutorials with working examples.",
  openGraph: {
    type: "website",
    siteName: "DevTools Online",
    locale: "en_US",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
