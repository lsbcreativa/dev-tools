import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG to React Component - Free Online | ToolboxURL",
  description:
    "Convert SVG markup to React JSX/TSX components. Auto-converts attributes, adds TypeScript props, forwardRef and memo. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/svg-to-react",
  },
  openGraph: {
    title: "SVG to React Component - Free Online Tool",
    description:
      "Convert SVG markup to React JSX/TSX components with TypeScript props, forwardRef and memo. No signup — 100% client-side.",
    url: "https://toolboxurl.com/svg-to-react",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
