import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getAllSlugs } from "@/lib/blog";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://toolboxurl.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://toolboxurl.com/blog/${post.slug}`,
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Organization",
          name: "DevTools Online",
          url: "https://toolboxurl.com",
        },
        publisher: {
          "@type": "Organization",
          name: "DevTools Online",
          url: "https://toolboxurl.com",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://toolboxurl.com/blog/${post.slug}`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  // Find adjacent posts for prev/next navigation
  const currentIndex = blogPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          All guides
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5">
              <Tag size={13} />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{post.title}</h1>
          <p className="mt-3 text-base text-[var(--muted-foreground)]">{post.description}</p>
        </header>

        <hr className="mb-8 border-[var(--border)]" />

        {/* Article body */}
        <article className="space-y-6 text-sm leading-relaxed">
          {/* Intro */}
          <p className="text-base leading-relaxed">{post.intro}</p>

          {/* Sections */}
          {post.sections.map((section, i) => (
            <section key={i}>
              <h2 className="mb-2 text-lg font-bold">{section.h2}</h2>
              <p className="text-[var(--muted-foreground)]">{section.body}</p>
            </section>
          ))}
        </article>

        {/* CTA to related tool */}
        <div className="my-8 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-5">
          <p className="mb-3 text-sm font-medium">Try it yourself — no signup needed</p>
          <Link
            href={post.relatedTool.href}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] btn-press"
          >
            {post.relatedTool.name}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* FAQs */}
        <section>
          <h2 className="mb-4 text-lg font-bold">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {post.faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border border-[var(--border)] bg-[var(--muted)]/50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium select-none">
                  {faq.question}
                  <span className="shrink-0 text-[var(--muted-foreground)] transition-transform group-open:rotate-180">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </summary>
                <div className="px-4 pb-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <nav className="mt-10 grid grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-left hover:border-[var(--primary)]/40 transition-colors"
              >
                <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                  <ArrowLeft size={12} />
                  Previous
                </span>
                <span className="text-sm font-medium leading-snug">{prevPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-right hover:border-[var(--primary)]/40 transition-colors"
              >
                <span className="flex items-center justify-end gap-1 text-xs text-[var(--muted-foreground)]">
                  Next
                  <ArrowRight size={12} />
                </span>
                <span className="text-sm font-medium leading-snug">{nextPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
