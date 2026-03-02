import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chmod Calculator Online - Free Tool | DevTools Online",
  description:
    "Calculate Unix file permissions with an interactive chmod calculator. Convert between numeric (755) and symbolic (rwxr-xr-x) notation. Free online tool.",
  alternates: {
    canonical: "https://devtoolsonline.com/chmod-calculator",
  },
  openGraph: {
    title: "Chmod Calculator Online - Free Online Tool",
    description:
      "Calculate Unix file permissions with an interactive chmod calculator. Convert between numeric (755) and symbolic (rwxr-xr-x) notation. Free online tool.",
    url: "https://devtoolsonline.com/chmod-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
