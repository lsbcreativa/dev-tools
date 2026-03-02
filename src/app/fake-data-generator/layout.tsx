import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fake Data Generator - Free Tool | DevTools Online",
  description:
    "Generate realistic fake data for testing: names, emails, phones, addresses, companies, and more. 100% client-side.",
  alternates: {
    canonical: "https://devtoolsonline.com/fake-data-generator",
  },
  openGraph: {
    title: "Fake Data Generator - Free Online Tool",
    description:
      "Generate realistic fake data for testing: names, emails, phones, addresses, companies, and more. 100% client-side.",
    url: "https://devtoolsonline.com/fake-data-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
