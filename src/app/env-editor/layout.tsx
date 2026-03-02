import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Env Variables Editor - Convert .env Free | ToolboxURL",
  description:
    "Edit environment variables visually. Convert between .env, JSON, YAML, and docker-compose formats. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/env-editor",
  },
  openGraph: {
    title: "Env Variables Editor - Free Online Tool",
    description:
      "Edit environment variables visually. Convert between .env, JSON, YAML, and docker-compose formats. No signup — 100% client-side.",
    url: "https://toolboxurl.com/env-editor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
