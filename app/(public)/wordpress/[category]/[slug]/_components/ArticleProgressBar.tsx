"use client";

import { useEffect, useState } from "react";

export default function ArticleProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(100, (window.scrollY / h) * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-rule">
      <div
        className="h-full transition-[width] duration-100 bg-accent"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}