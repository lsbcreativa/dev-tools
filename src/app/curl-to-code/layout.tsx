import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curl to Code - Free Tool | DevTools Online",
  description:
    "Convert curl commands to JavaScript (fetch/axios), Python (requests), Go (net/http), and PHP (curl) code snippets.",
  alternates: {
    canonical: "https://devtoolsonline.com/curl-to-code",
  },
  openGraph: {
    title: "Curl to Code - Free Online Tool",
    description:
      "Convert curl commands to JavaScript (fetch/axios), Python (requests), Go (net/http), and PHP (curl) code snippets.",
    url: "https://devtoolsonline.com/curl-to-code",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
