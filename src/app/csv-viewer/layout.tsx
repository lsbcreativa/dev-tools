import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV Viewer & Editor - Free Tool | DevTools Online",
  description:
    "View, sort, search, and export CSV data. Supports custom delimiters, quoted fields, and file upload.",
  alternates: {
    canonical: "https://devtoolsonline.com/csv-viewer",
  },
  openGraph: {
    title: "CSV Viewer & Editor - Free Online Tool",
    description:
      "View, sort, search, and export CSV data. Supports custom delimiters, quoted fields, and file upload.",
    url: "https://devtoolsonline.com/csv-viewer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
