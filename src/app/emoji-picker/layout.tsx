import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emoji Picker & Search - Free Tool | DevTools Online",
  description:
    "Search and copy emojis instantly. Browse by category, search by name, and keep track of recently used emojis.",
  alternates: {
    canonical: "https://devtoolsonline.com/emoji-picker",
  },
  openGraph: {
    title: "Emoji Picker & Search - Free Online Tool",
    description:
      "Search and copy emojis instantly. Browse by category, search by name, and keep track of recently used emojis.",
    url: "https://devtoolsonline.com/emoji-picker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
