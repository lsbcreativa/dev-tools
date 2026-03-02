import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Parser — Break Down Any URL | DevTools Online",
  description:
    "Parse any URL into its components: protocol, hostname, port, path, query parameters, and hash. Visual breakdown with copy buttons.",
  alternates: {
    canonical: "https://toolboxurl.com/url-parser",
  },
  openGraph: {
    title: "URL Parser — Break Down Any URL | DevTools Online",
    description:
      "Parse any URL into its components: protocol, hostname, port, path, query parameters, and hash. Visual breakdown with copy buttons.",
    url: "https://toolboxurl.com/url-parser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
