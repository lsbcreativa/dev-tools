import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excel Viewer - View .xlsx Files Free | ToolboxURL",
  description:
    "Open and view Excel (.xlsx) files in your browser. Browse sheets, sort columns, search data. No signup — 100% client-side.",
  alternates: {
    canonical: "https://toolboxurl.com/excel-viewer",
  },
  openGraph: {
    title: "Excel Viewer - Free Online Tool",
    description:
      "Open and view Excel (.xlsx) files in your browser. Browse sheets, sort columns, search data. No signup — 100% client-side.",
    url: "https://toolboxurl.com/excel-viewer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
