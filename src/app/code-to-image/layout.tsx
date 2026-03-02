import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code to Image - Code Screenshots Free | ToolboxURL",
  description:
    "Generate beautiful code screenshots with custom themes, fonts, and backgrounds. Like Carbon.sh but free and unlimited.",
  alternates: {
    canonical: "https://toolboxurl.com/code-to-image",
  },
  openGraph: {
    title: "Code to Image - Free Online Tool",
    description:
      "Generate beautiful code screenshots with custom themes, fonts, and backgrounds. Like Carbon.sh but free and unlimited.",
    url: "https://toolboxurl.com/code-to-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
