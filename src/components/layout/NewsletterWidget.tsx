"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

// Set NEXT_PUBLIC_NEWSLETTER_FORM_URL in .env.local
// Example (Mailchimp): https://xxx.us1.list-manage.com/subscribe/post?u=xxx&id=xxx
// Example (ConvertKit): https://app.convertkit.com/forms/xxxxx/subscriptions
const FORM_URL = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_URL ?? "";

export default function NewsletterWidget() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (FORM_URL) {
      // Redirect to hosted form with email pre-filled
      const separator = FORM_URL.includes("?") ? "&" : "?";
      const url = `${FORM_URL}${separator}EMAIL=${encodeURIComponent(email)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Fallback: open blank Mailchimp signup page
      window.open("https://mailchimp.com/", "_blank", "noopener,noreferrer");
    }
    setEmail("");
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <Mail size={15} className="text-[var(--primary)]" />
        <span className="text-sm font-semibold">Stay updated</span>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
        Get notified when new tools and guides are published. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] btn-press"
        >
          Subscribe
          <ArrowRight size={13} />
        </button>
      </form>
    </div>
  );
}
