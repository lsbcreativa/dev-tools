"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    // Start progress
    setVisible(true);
    setProgress(0);

    // Animate to 100%
    requestAnimationFrame(() => {
      setProgress(100);
    });

    // Hide after animation completes
    timer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 500);

    return () => clearTimeout(timer.current);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none">
      <div
        className="h-full rounded-r-full"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? "none" : "width 400ms ease-out",
          background: "linear-gradient(90deg, var(--primary), #7c3aed, #ec4899)",
          boxShadow: "0 0 8px var(--primary), 0 0 4px #7c3aed",
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: "width, opacity",
          transitionDuration: progress === 0 ? "0ms" : "400ms, 300ms",
          transitionDelay: progress === 100 ? "0ms, 200ms" : "0ms",
        }}
      />
    </div>
  );
}
