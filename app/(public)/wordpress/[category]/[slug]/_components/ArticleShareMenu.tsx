"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bookmark,
  Check,
  Copy,
  Facebook,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react";

interface Props {
  title: string;
  slug: string;
}

export default function ArticleShareMenu({ title, slug }: Props) {
  /**
   * FIX: Lazy Initializer.
   * This function runs only ONCE during the initial state creation.
   * Because it happens before the first render, it avoids the "cascading render" 
   * warning entirely and ensures the UI is correct from the very first frame.
   */
  const [bookmarked, setBookmarked] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved: string[] = JSON.parse(
        localStorage.getItem("kn_bookmarks") ?? "[]"
      );
      return saved.includes(slug);
    } catch {
      return false;
    }
  });

  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Helper to read the latest status without triggering renders
  const getLatestStatus = useCallback(() => {
    if (typeof window === "undefined") return false;
    const saved: string[] = JSON.parse(localStorage.getItem("kn_bookmarks") ?? "[]");
    return saved.includes(slug);
  }, [slug]);

  /**
   * EFFECT: Subscriptions ONLY.
   * We no longer call setBookmarked(initial) here.
   * This effect now strictly listens for external changes (other tabs/components).
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Respond to changes from other tabs
      if (e.key === "kn_bookmarks" || e.key === null) {
        setBookmarked(getLatestStatus());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [getLatestStatus]);

  // Close share panel when clicking outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleBookmark = () => {
    try {
      const saved: string[] = JSON.parse(
        localStorage.getItem("kn_bookmarks") ?? "[]"
      );

      const isCurrentlyBookmarked = saved.includes(slug);
      const updated = isCurrentlyBookmarked
        ? saved.filter((s) => s !== slug)
        : [...saved, slug];

      localStorage.setItem("kn_bookmarks", JSON.stringify(updated));
      
      // Toggle state locally
      setBookmarked(!isCurrentlyBookmarked);

      // Manually trigger the event for other components in the same tab
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    }
  };

  const handleShare = (platform: "twitter" | "facebook" | "linkedin" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(urls[platform], "_blank", "noopener,noreferrer");
    }
    setShareOpen(false);
  };

  const SHARE_OPTIONS = [
    { id: "twitter" as const, label: "X / Twitter", bg: "#e7f3ff", fg: "#1a8cd8" },
    { id: "facebook" as const, label: "Facebook", bg: "#eef1fb", fg: "#1877f2" },
    { id: "linkedin" as const, label: "LinkedIn", bg: "#e8f3fa", fg: "#0a66c2" },
    {
      id: "copy" as const,
      label: copied ? "Copied!" : "Copy link",
      bg: "var(--color-paper-warm)",
      fg: "var(--color-ink-soft)",
    },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      <div className="relative" ref={shareRef}>
        <button
          onClick={() => setShareOpen((v) => !v)}
          className="kn-action-btn"
          style={{
            background: shareOpen ? "var(--color-ink)" : "transparent",
            color: shareOpen ? "#fff" : "var(--color-ink-soft)",
            borderColor: shareOpen ? "var(--color-ink)" : "var(--color-rule)",
          }}
          aria-label="Share article"
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>

        {shareOpen && (
          <div className="kn-share-panel">
            <p className="kn-share-title">Share this story</p>
            <div className="grid grid-cols-2 gap-1.5">
              {SHARE_OPTIONS.map(({ id, label, bg, fg }) => (
                <button
                  key={id}
                  onClick={() => handleShare(id)}
                  className="kn-share-chip"
                  style={{ background: bg, color: fg }}
                >
                  {id === "twitter" && <Twitter size={13} />}
                  {id === "facebook" && <Facebook size={13} />}
                  {id === "linkedin" && <Linkedin size={13} />}
                  {id === "copy" && (copied ? <Check size={13} /> : <Copy size={13} />)}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleBookmark}
        className="kn-action-btn"
        style={{
          borderColor: bookmarked ? "var(--color-accent)" : "var(--color-rule)",
          color: bookmarked ? "var(--color-accent)" : "var(--color-ink-soft)",
        }}
        aria-label={bookmarked ? "Remove bookmark" : "Save article"}
      >
        <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
        <span>{bookmarked ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
}