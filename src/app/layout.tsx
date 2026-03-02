import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchDialog from "@/components/layout/SearchDialog";
import { ToastProvider } from "@/components/ui/Toast";
import { tools } from "@/lib/tools";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://toolboxurl.com"),
  title: {
    default: "DevTools Online - Free Developer Tools",
    template: "%s | DevTools Online",
  },
  description:
    "70+ free developer tools that run in your browser. JSON formatter, regex tester, code converters, CSS generators and more. No signup, no servers — 100% private.",
  keywords: [
    "developer tools",
    "online tools",
    "json formatter",
    "base64 encoder",
    "password generator",
    "regex tester",
    "free tools",
    "online developer tools",
    "web tools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevTools Online",
    title: "DevTools Online - Free Developer Tools",
    description:
      "70+ developer tools that run entirely in your browser. No servers, no signups, no data collection.",
    url: "https://toolboxurl.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTools Online - Free Developer Tools",
    description:
      "70+ free developer tools — no servers, no signups. Runs 100% in your browser.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://toolboxurl.com",
  },
};

// Inline script to prevent flash of wrong theme on page load
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light')return;document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})()`;

// Google Analytics
const gaScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-C8CC3XNYFV');`;

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "DevTools Online",
      url: "https://toolboxurl.com",
      description:
        "70+ developer tools that run entirely in your browser. JSON formatter, regex tester, code converters, CSS generators and more.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://toolboxurl.com/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      name: "DevTools Online",
      url: "https://toolboxurl.com",
      description:
        "70+ developer tools that run entirely in your browser. JSON formatter, regex tester, code converters, CSS generators and more.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: tools.map((t) => t.name),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-C8CC3XNYFV" />
        <script dangerouslySetInnerHTML={{ __html: gaScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SearchDialog />
        </ToastProvider>
      </body>
    </html>
  );
}
