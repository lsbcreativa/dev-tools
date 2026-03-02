interface SeoSection {
  title: string;
  content: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoContentProps {
  sections: SeoSection[];
  faqs: FaqItem[];
}

export default function SeoContent({ sections, faqs }: SeoContentProps) {
  return (
    <article className="mt-8 space-y-6">
      <hr className="border-[var(--border)]" />

      {sections.map((section, i) => (
        <section key={i}>
          <h2 className="text-lg font-bold mb-2">{section.title}</h2>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            {section.content}
          </p>
        </section>
      ))}

      {faqs.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border border-[var(--border)] bg-[var(--muted)]/50"
              >
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium select-none list-none flex items-center justify-between gap-2">
                  {faq.question}
                  <span className="shrink-0 text-[var(--muted-foreground)] transition-transform group-open:rotate-180">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </summary>
                <div className="px-4 pb-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
