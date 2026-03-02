import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IP Subnet Calculator - Free Tool | DevTools Online",
  description:
    "Calculate IPv4 subnet details including network address, broadcast address, host range, wildcard mask, and CIDR notation.",
  alternates: {
    canonical: "https://devtoolsonline.com/subnet-calculator",
  },
  openGraph: {
    title: "IP Subnet Calculator - Free Online Tool",
    description:
      "Calculate IPv4 subnet details including network address, broadcast address, host range, wildcard mask, and CIDR notation.",
    url: "https://devtoolsonline.com/subnet-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
