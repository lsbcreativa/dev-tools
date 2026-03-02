"use client";

import { useEffect, useRef } from "react";

// Carbon Ads: apply at https://www.carbonads.net/
// Once approved, set NEXT_PUBLIC_CARBON_ADS_SERVE in .env.local
// Example: NEXT_PUBLIC_CARBON_ADS_SERVE=CWYD4K3N

const CARBON_SERVE = process.env.NEXT_PUBLIC_CARBON_ADS_SERVE ?? "";

export default function AdBanner({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (!CARBON_SERVE || injected.current || !containerRef.current) return;
    injected.current = true;

    const script = document.createElement("script");
    script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE}&placement=toolboxurlcom`;
    script.id = "_carbonads_js";
    script.async = true;
    script.type = "text/javascript";
    containerRef.current.appendChild(script);

    return () => {
      const el = document.getElementById("_carbonads_js");
      if (el) el.remove();
      const ad = document.getElementById("carbonads");
      if (ad) ad.remove();
      injected.current = false;
    };
  }, []);

  if (!CARBON_SERVE) return null;

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden rounded-xl ${className ?? ""}`}
    />
  );
}
