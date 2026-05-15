// app/(public)/wordpress/[category]/[slug]/_components/ArticleShareButton.tsx
"use client";

import { useRef, useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";

interface Props {
  title: string;
}

type Platform = "twitter" | "facebook" | "linkedin" | "copy";

interface ShareChip {
  id: Platform;
  label: string;
  bg: string;
  fg: string;
}

const CHIPS: ShareChip[] = [
  { id: "twitter",  label: "X / Twitter", bg: "#e7f3ff", fg: "#1a8cd8" },
  { id: "facebook", label: "Facebook",    bg: "#eef1fb", fg: "#1877f2" },
  { id: "linkedin", label: "LinkedIn",    bg: "#e8f3fa", fg: "#0a66c2" },
  { id: "copy",     label: "Copy link",   bg: "var(--paper-warm)", fg: "var(--ink-soft)" },
];

export default function ArticleShareButton({ title }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleShare = (platform: Platform) => {
    const url = window.location.href;
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    const urls: Record<Exclude<Platform, "copy">, string> = {
      twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(urls[platform], "_blank", "noopener");
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="kn-action-btn"
        style={{
          background: open ? "var(--ink)" : "transparent",
          color: open ? "#fff" : "var(--ink-soft)",
          borderColor: open ? "var(--ink)" : "var(--rule)",
        }}
        aria-label="Share article"
      >
        <Share2 size={14} />
        <span>Share</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[230px] bg-white border border-[var(--rule)] rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4">
          <p className="font-['Barlow_Condensed'] text-[9px] font-bold tracking-[0.18em] uppercase text-[var(--ink-faint)] mb-2.5">
            Share this story
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {CHIPS.map(({ id, label, bg, fg }) => (
              <button
                key={id}
                onClick={() => handleShare(id)}
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border-none cursor-pointer font-['Barlow_Condensed'] text-[11px] font-bold hover:brightness-[1.08] transition-all"
                style={{ background: bg, color: fg }}
              >
                {id === "twitter"  && <Twitter  size={13} />}
                {id === "facebook" && <Facebook size={13} />}
                {id === "linkedin" && <Linkedin size={13} />}
                {id === "copy"     && (copied ? <Check size={13} /> : <Copy size={13} />)}
                <span>{id === "copy" && copied ? "Copied!" : label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}