export default function AdBanner({ className, adSlot }: { className?: string; adSlot?: string }) {
  if (!adSlot) return null;

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 text-xs text-[var(--muted-foreground)] ${className ?? ""}`}
      style={{ minHeight: 90 }}
    >
      {/* Insert your Google AdSense <ins> code here using the adSlot prop */}
    </div>
  );
}
