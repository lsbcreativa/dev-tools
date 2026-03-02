import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nginx Config Generator - Free Tool | DevTools Online",
  description:
    "Generate production-ready Nginx configuration files for static sites, reverse proxies, SPAs, and PHP apps. Supports SSL, gzip, and CORS.",
  alternates: {
    canonical: "https://toolboxurl.com/nginx-config",
  },
  openGraph: {
    title: "Nginx Config Generator - Free Online Tool",
    description:
      "Generate production-ready Nginx configuration files for static sites, reverse proxies, SPAs, and PHP apps. Supports SSL, gzip, and CORS.",
    url: "https://toolboxurl.com/nginx-config",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
