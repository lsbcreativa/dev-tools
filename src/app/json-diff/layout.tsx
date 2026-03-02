import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Diff Viewer - Free Tool | DevTools Online",
  description:
    "Compare two JSON objects and visualize differences. Highlights added, removed, and changed keys with a color-coded tree view.",
  alternates: {
    canonical: "https://devtoolsonline.com/json-diff",
  },
  openGraph: {
    title: "JSON Diff Viewer - Free Online Tool",
    description:
      "Compare two JSON objects and visualize differences. Highlights added, removed, and changed keys with a color-coded tree view.",
    url: "https://devtoolsonline.com/json-diff",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
