import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Git Command Builder - Visual Git Free | ToolboxURL",
  description:
    "Build git commands visually with dropdowns and checkboxes. Merge, rebase, reset, stash and more explained. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/git-command-builder",
  },
  openGraph: {
    title: "Git Command Builder - Free Online Tool",
    description:
      "Build git commands visually with dropdowns and checkboxes. Merge, rebase, reset, stash and more explained. No signup — 100% client-side.",
    url: "https://toolboxurl.com/git-command-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
