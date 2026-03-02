export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-[3px]">
        <div className="loading-bar h-full rounded-r-full" />
      </div>

      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="skeleton h-4 w-12" />
        <div className="h-4 w-2 text-[var(--muted-foreground)]">/</div>
        <div className="skeleton h-4 w-32" />
      </div>

      {/* Title + description skeleton */}
      <div className="mb-6">
        <div className="skeleton h-8 w-64 mb-3" />
        <div className="skeleton h-4 w-96 max-w-full" />
      </div>

      {/* Tool content skeleton */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="skeleton h-10 w-32" />
          <div className="skeleton h-10 w-24" />
          <div className="skeleton h-10 w-28" />
        </div>

        {/* Main content area */}
        <div className="space-y-4">
          <div className="skeleton h-40 w-full" />
          <div className="flex gap-4">
            <div className="skeleton h-10 w-full flex-1" />
            <div className="skeleton h-10 w-full flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
