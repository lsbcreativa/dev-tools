import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "React Component Generator - Free Online | ToolboxURL",
  description:
    "Generate React functional components with TypeScript, hooks, forwardRef, memo and props. Scaffold components instantly. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/react-generator",
  },
  openGraph: {
    title: "React Component Generator - Free Online Tool",
    description:
      "Generate React functional components with TypeScript, hooks, forwardRef, memo and props. No signup — 100% client-side.",
    url: "https://toolboxurl.com/react-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
