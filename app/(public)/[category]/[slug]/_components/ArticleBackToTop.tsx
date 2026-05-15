"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ArticleBackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="kn-back-top"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}