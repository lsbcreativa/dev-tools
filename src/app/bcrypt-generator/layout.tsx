import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bcrypt Password Hash Generator & Verifier | DevTools Online",
  description:
    "Hash passwords using bcrypt-compatible algorithm in your browser. Verify hashes instantly. 100% client-side, your passwords never leave your device.",
  alternates: {
    canonical: "https://toolboxurl.com/bcrypt-generator",
  },
  openGraph: {
    title: "Bcrypt Password Hash Generator & Verifier | DevTools Online",
    description:
      "Hash passwords using bcrypt-compatible algorithm in your browser. Verify hashes instantly. 100% client-side, your passwords never leave your device.",
    url: "https://toolboxurl.com/bcrypt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
