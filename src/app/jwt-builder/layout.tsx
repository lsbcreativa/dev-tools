import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Builder - Free Tool | DevTools Online",
  description:
    "Build and sign JSON Web Tokens (JWT) with HS256. Edit header and payload, set expiration, and generate signed tokens.",
  alternates: {
    canonical: "https://devtoolsonline.com/jwt-builder",
  },
  openGraph: {
    title: "JWT Builder - Free Online Tool",
    description:
      "Build and sign JSON Web Tokens (JWT) with HS256. Edit header and payload, set expiration, and generate signed tokens.",
    url: "https://devtoolsonline.com/jwt-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
