import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for DevTools Online. Learn how we protect your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">Last updated: February 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Overview</h2>
          <p>
            DevTools Online is committed to protecting your privacy. All tools on this website
            run entirely in your browser. No data is collected, stored, or transmitted to any server.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Data Collection</h2>
          <p>
            We do not collect any personal data. We do not use cookies for tracking purposes.
            All processing happens locally in your browser using JavaScript. Your input data
            (text, JSON, passwords, etc.) never leaves your device.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Local Storage</h2>
          <p>
            We use browser localStorage only to save your theme preference (light or dark mode).
            This data stays on your device and is never sent anywhere.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Third-Party Services</h2>
          <p>
            We may display advertisements through Google AdSense. Google may use cookies to
            serve ads based on your prior visits to this or other websites. You can opt out
            of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] underline underline-offset-2"
            >
              Google Ads Settings
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Google Fonts</h2>
          <p>
            This website uses Google Fonts (Inter) which are loaded from Google servers.
            Google may collect usage data as described in their privacy policy.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Changes</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be reflected
            on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Contact</h2>
          <p>
            If you have questions about this privacy policy, please open an issue on our
            GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
}
