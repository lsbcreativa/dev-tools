import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS to Tailwind - Free Tool | DevTools Online",
  description:
    "Convert CSS properties to Tailwind CSS utility classes. Supports display, spacing, typography, layout, and more.",
  alternates: {
    canonical: "https://toolboxurl.com/css-to-tailwind",
  },
  openGraph: {
    title: "CSS to Tailwind - Free Online Tool",
    description:
      "Convert CSS properties to Tailwind CSS utility classes. Supports display, spacing, typography, layout, and more.",
    url: "https://toolboxurl.com/css-to-tailwind",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
