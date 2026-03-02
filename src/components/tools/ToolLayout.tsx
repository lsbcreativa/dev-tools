import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import AdBanner from "@/components/layout/AdBanner";
import ToolActions from "@/components/tools/ToolActions";
import { getToolBySlug, getRelatedTools, getAdjacentTools, categories } from "@/lib/tools";
import { iconMap } from "@/lib/icons";

export default function ToolLayout({
  title,
  description,
  slug,
  children,
  seoContent,
  faqs,
}: {
  title: string;
  description: string;
  slug?: string;
  children: React.ReactNode;
  seoContent?: React.ReactNode;
  faqs?: { question: string; answer: string }[];
}) {
  const tool = slug ? getToolBySlug(slug) : null;
  const related = slug ? getRelatedTools(slug) : [];
  const adjacent = slug ? getAdjacentTools(slug) : { prev: null, next: null };
  const categoryLabel = tool ? categories[tool.category].label : null;

  const toolJsonLd = tool
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://toolboxurl.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: categoryLabel,
                item: `https://toolboxurl.com/#${tool.category}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: tool.name,
              },
            ],
          },
          {
            "@type": "SoftwareApplication",
            name: tool.name,
            url: `https://toolboxurl.com/${slug}`,
            description: tool.description,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          },
        ],
      }
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      {toolJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
        />
      )}
      {faqs && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.answer,
                },
              })),
            }),
          }}
        />
      )}

      {/* Breadcrumbs */}
      {tool && (
        <nav className="mb-4 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/#${tool.category}`} className="hover:text-[var(--foreground)] transition-colors">{categoryLabel}</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--foreground)] font-medium truncate">{tool.name}</span>
        </nav>
      )}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">{description}</p>
        </div>
        {slug && <ToolActions slug={slug} />}
      </div>

      <AdBanner className="mb-6" />

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm sm:p-6">
        {children}
      </div>

      {seoContent && (
        <div className="mt-8 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm sm:p-6">
          {seoContent}
        </div>
      )}

      {/* Prev/Next */}
      {(adjacent.prev || adjacent.next) && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {adjacent.prev ? (
            <Link href={`/${adjacent.prev.slug}`} prefetch={false} className="group flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--primary)] hover:shadow-sm">
              <ArrowLeft size={16} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-[var(--muted-foreground)]">Previous</div>
                <div className="text-sm font-medium truncate">{adjacent.prev.name}</div>
              </div>
            </Link>
          ) : <div />}
          {adjacent.next && (
            <Link href={`/${adjacent.next.slug}`} prefetch={false} className="group flex items-center justify-end gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-right transition-all hover:border-[var(--primary)] hover:shadow-sm">
              <div className="min-w-0">
                <div className="text-xs text-[var(--muted-foreground)]">Next</div>
                <div className="text-sm font-medium truncate">{adjacent.next.name}</div>
              </div>
              <ArrowRight size={16} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] shrink-0" />
            </Link>
          )}
        </div>
      )}

      {/* Related tools */}
      {related.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold text-[var(--muted-foreground)]">Related tools</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((t) => {
              const Icon = iconMap[t.icon];
              return (
                <Link key={t.slug} href={`/${t.slug}`} prefetch={false} className="group flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3 transition-all hover:border-[var(--primary)] hover:shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
                    {Icon && <Icon size={14} />}
                  </div>
                  <span className="text-sm font-medium truncate">{t.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <AdBanner className="mt-6" />
    </div>
  );
}
