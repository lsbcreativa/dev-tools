import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docker Run to Compose - Free Tool | DevTools Online",
  description:
    "Convert docker run commands to docker-compose.yml format instantly. Supports ports, volumes, environment variables, networks, and more.",
  alternates: {
    canonical: "https://devtoolsonline.com/docker-compose",
  },
  openGraph: {
    title: "Docker Run to Compose - Free Online Tool",
    description:
      "Convert docker run commands to docker-compose.yml format instantly. Supports ports, volumes, environment variables, networks, and more.",
    url: "https://devtoolsonline.com/docker-compose",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
