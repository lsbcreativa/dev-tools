import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator - Strong Random Passwords | DevTools Online",
  description:
    "Generate strong, secure random passwords with customizable length and character types. Free online password generator.",
  alternates: {
    canonical: "https://toolboxurl.com/password-generator",
  },
  openGraph: {
    title: "Password Generator - Strong Random Passwords - Free Online Tool",
    description:
      "Generate strong, secure random passwords with customizable length and character types. Free online password generator.",
    url: "https://toolboxurl.com/password-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
