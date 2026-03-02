import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Request Builder - Test APIs Free | ToolboxURL",
  description:
    "Build and test HTTP requests (GET, POST, PUT, DELETE) with custom headers and body. View responses instantly. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/api-tester",
  },
  openGraph: {
    title: "API Request Builder - Free Online Tool",
    description:
      "Build and test HTTP requests with custom headers and body. View responses instantly. No signup — 100% client-side.",
    url: "https://toolboxurl.com/api-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
