import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Developer Guides & Tutorials",
  description:
    "Free developer guides covering Base64, JWT, JSON, regex, URL encoding, password hashing, and more. Practical tutorials with working examples.",
  alternates: {
    canonical: "https://toolboxurl.com/blog",
  },
};

const categoryColors: Record<string, string> = {
  "Developer Guides": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Security: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Design: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "DevTools Online Blog",
    description: "Developer guides and tutorials for web developers.",
    url: "https://toolboxurl.com/blog",
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `https://toolboxurl.com/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Developer Guides</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Practical tutorials for every tool on this site
            </p>
          </div>
        </div>

        {/* Articles grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:border-[var(--primary)]/40 hover:shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    categoryColors[post.category] ??
                    "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {post.category}
                </span>
                <time className="text-xs text-[var(--muted-foreground)]" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>

              <h2 className="mb-2 text-base font-semibold leading-snug group-hover:text-[var(--primary)] transition-colors">
                {post.title}
              </h2>

              <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {post.description}
              </p>

              <div className="flex items-center gap-1 text-sm font-medium text-[var(--primary)]">
                Read guide
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
