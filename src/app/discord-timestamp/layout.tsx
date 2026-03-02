import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discord Timestamp Generator — Create Discord Time Tags | DevTools Online",
  description:
    "Generate Discord timestamp tags from any date and time. Preview all 7 format styles. Copy the <t:unix:format> code instantly for your Discord messages.",
  alternates: {
    canonical: "https://toolboxurl.com/discord-timestamp",
  },
  openGraph: {
    title: "Discord Timestamp Generator — Create Discord Time Tags | DevTools Online",
    description:
      "Generate Discord timestamp tags from any date and time. Preview all 7 format styles. Copy the <t:unix:format> code instantly for your Discord messages.",
    url: "https://toolboxurl.com/discord-timestamp",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
