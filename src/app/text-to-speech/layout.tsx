import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to Speech - Free Tool | DevTools Online",
  description:
    "Convert text to speech using your browser's built-in speech synthesis. Choose from available voices, adjust rate and pitch.",
  alternates: {
    canonical: "https://toolboxurl.com/text-to-speech",
  },
  openGraph: {
    title: "Text to Speech - Free Online Tool",
    description:
      "Convert text to speech using your browser's built-in speech synthesis. Choose from available voices, adjust rate and pitch.",
    url: "https://toolboxurl.com/text-to-speech",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
