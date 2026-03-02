import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GraphQL Formatter & Prettifier Online | DevTools Online",
  description:
    "Format, prettify and minify GraphQL queries, mutations, and schema definitions online. Clean indentation, remove comments. Free GraphQL formatter.",
  alternates: {
    canonical: "https://toolboxurl.com/graphql-formatter",
  },
  openGraph: {
    title: "GraphQL Formatter & Prettifier Online | DevTools Online",
    description:
      "Format, prettify and minify GraphQL queries, mutations, and schema definitions online. Clean indentation, remove comments. Free GraphQL formatter.",
    url: "https://toolboxurl.com/graphql-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
