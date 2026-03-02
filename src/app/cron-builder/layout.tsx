import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crontab Visual Builder - Free Tool | DevTools Online",
  description:
    "Build cron expressions visually with a simple UI. See human-readable descriptions and next execution times.",
  alternates: {
    canonical: "https://devtoolsonline.com/cron-builder",
  },
  openGraph: {
    title: "Crontab Visual Builder - Free Online Tool",
    description:
      "Build cron expressions visually with a simple UI. See human-readable descriptions and next execution times.",
    url: "https://devtoolsonline.com/cron-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
