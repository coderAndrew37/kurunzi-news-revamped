import { urlFor } from "@/lib/sanity/image";
import {
  PortableText,
  PortableTextComponents,
  PortableTextProps,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

// ── Type declarations ─────────────────────────────────────────────────────────
interface InlineImageValue {
  _type: "inlineImage";
  alt?: string;
  caption?: string;
  attribution?: string;
  asset?: { _ref: string; _type: "reference" };
}
interface YouTubeValue {
  _type: "youtube";
  url: string;
  videoCaption?: string;
}
interface InlineRelatedValue {
  _type: "inlineRelated";
  post: {
    title: string;
    slug: string;
    categorySlug: string;
    mainImage: any;
  };
}

// ── Portable Text component map ───────────────────────────────────────────────
const components: PortableTextComponents = {
  block: {
    // Section headline — red left-border accent
    h2: ({ children }) => <h2 className="pt-h2">{children}</h2>,
    // Sub-section
    h3: ({ children }) => <h3 className="pt-h3">{children}</h3>,
    // Label kicker
    h4: ({ children }) => <h4 className="pt-h4">{children}</h4>,
    // Body paragraph — Source Serif, comfortable leading
    normal: ({ children }) => <p className="pt-p">{children}</p>,
    // Pull quote — newspaper-style between double rules
    blockquote: ({ children }) => (
      <blockquote className="pt-blockquote">{children}</blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => <ul className="pt-ul">{children}</ul>,
    number: ({ children }) => <ol className="pt-ol">{children}</ol>,
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="pt-li pt-li-bullet">{children}</li>
    ),
    number: ({ children }) => (
      <li className="pt-li pt-li-number">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="pt-strong">{children}</strong>,
    em: ({ children }) => <em className="pt-em">{children}</em>,
    code: ({ children }) => <code className="pt-code">{children}</code>,
    underline: ({ children }) => (
      <u className="underline underline-offset-2">{children}</u>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={
          value?.href?.startsWith("http") ? "noopener noreferrer" : undefined
        }
        className="pt-link"
      >
        {children}
      </a>
    ),
  },

  types: {
    // ── Read Also card ──────────────────────────────────────────────────────
    inlineRelated: ({ value }: { value: InlineRelatedValue }) => {
      if (!value?.post?.slug) return null;
      return (
        <Link
          href={`/${value.post.categorySlug}/${value.post.slug}`}
          className="pt-related"
        >
          <div className="flex-1 min-w-0">
            <span className="pt-related-kicker">Read Also</span>
            <h4 className="pt-related-headline">{value.post.title}</h4>
          </div>
          {value.post.mainImage && (
            <div className="relative flex-shrink-0 overflow-hidden rounded pt-related-thumb">
              <Image
                src={urlFor(value.post.mainImage).width(300).height(200).url()}
                alt={value.post.title}
                fill
                className="object-cover pt-related-img"
              />
            </div>
          )}
        </Link>
      );
    },

    // ── Inline image with caption ───────────────────────────────────────────
    inlineImage: ({ value }: { value: InlineImageValue }) => {
      if (!value?.asset?._ref) {
        console.warn("[PortableText] inlineImage missing asset._ref", value);
        return null;
      }
      return (
        <figure className="pt-figure">
          <div
            className="relative w-full overflow-hidden rounded pt-figure-ratio"
            style={{ background: "var(--paper-warm)" }}
          >
            <Image
              src={urlFor(value).url()}
              alt={value.alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover"
            />
          </div>
          {(value.caption || value.attribution) && (
            <figcaption className="pt-figcaption">
              {value.caption}
              {value.attribution && (
                <cite className="pt-credit"> — {value.attribution}</cite>
              )}
            </figcaption>
          )}
        </figure>
      );
    },

    // ── YouTube embed ───────────────────────────────────────────────────────
    youtube: ({ value }: { value: YouTubeValue }) => {
      const id = value.url?.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?/\s]{11})/,
      )?.[1];
      if (!id) return null;
      return (
        <div className="pt-video">
          <div
            className="relative w-full overflow-hidden rounded-lg pt-video-ratio"
            style={{ background: "#000" }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          {value.videoCaption && (
            <p className="pt-video-caption">{value.videoCaption}</p>
          )}
        </div>
      );
    },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function CustomPortableText({
  value,
}: {
  value: PortableTextProps["value"];
}) {
  if (!value) return null;

  return (
    <>
      <div className="pt-root">
        <PortableText value={value} components={components} />
      </div>

      {/* ── Scoped styles ──────────────────────────────────────────────────
          Tailwind cannot express:
          • CSS custom properties / var()
          • ::first-letter drop-cap (float + multi-property)
          • counter-reset / counter-increment on li::before
          • :first-of-type paragraph targeting
          • parent-selector hover chains
      ─────────────────────────────────────────────────────────────────── */}
      <style>{`
        /* ── Tokens (inherit from page if already set) ── */
        .pt-root {
          --ink:        #0d0d0d;
          --ink-soft:   #3d3935;
          --ink-muted:  #7a736c;
          --ink-faint:  #b5aea7;
          --paper-warm: #f7f4f0;
          --rule:       #e8e2da;
          --red:        #c8191e;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body:    'Source Serif 4', Georgia, serif;
          --font-ui:      'Barlow Condensed', system-ui, sans-serif;
          max-width: 100%;
        }

        /* ── Body paragraphs ── */
        .pt-p {
          font-family: var(--font-body);
          font-size: 1.125rem;
          line-height: 1.85;
          color: var(--ink-soft);
          margin: 0 0 1.5em;
          font-weight: 400;
        }

        /* Drop-cap on the very first paragraph */
        .pt-root > .pt-p:first-of-type::first-letter {
          font-family: var(--font-display);
          font-size: 4em;
          font-weight: 900;
          line-height: .78;
          float: left;
          margin: .04em .1em -.04em 0;
          color: var(--ink);
        }

        /* ── Headings ── */
        .pt-h2 {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 1.75rem);
          font-weight: 900;
          line-height: 1.18;
          letter-spacing: -.02em;
          color: var(--ink);
          margin: 2.5em 0 .6em;
          padding-left: 14px;
          border-left: 3px solid var(--red);
        }
        .pt-h3 {
          font-family: var(--font-display);
          font-size: clamp(1.2rem, 2.5vw, 1.4rem);
          font-weight: 700;
          line-height: 1.22;
          color: var(--ink);
          margin: 2em 0 .5em;
        }
        .pt-h4 {
          font-family: var(--font-ui);
          font-size: .8rem;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin: 1.8em 0 .4em;
        }

        /* ── Blockquote — newspaper pull-quote between rules ── */
        .pt-blockquote {
          position: relative;
          margin: 2.8em 0;
          padding: 1.4em 1.8em 1.4em 1.8em;
          border-top: 2px solid var(--ink);
          border-bottom: 2px solid var(--ink);
          background: transparent;
        }
        .pt-blockquote::before {
          content: '"';
          position: absolute;
          top: -28px;
          left: 0;
          font-family: var(--font-display);
          font-size: 6.5rem;
          color: var(--red);
          line-height: 1;
          font-weight: 900;
          opacity: .9;
        }
        /* Override any nested p inside blockquote */
        .pt-blockquote .pt-p,
        .pt-blockquote p {
          font-family: var(--font-display);
          font-size: clamp(1.1rem, 2.5vw, 1.35rem);
          font-style: italic;
          font-weight: 700;
          line-height: 1.45;
          color: var(--ink);
          margin: 0;
        }
        /* Kill drop-cap inside blockquote */
        .pt-blockquote .pt-p::first-letter,
        .pt-blockquote p::first-letter {
          font-size: inherit !important;
          float: none !important;
          margin: 0 !important;
          font-weight: inherit !important;
          color: inherit !important;
        }

        /* ── Lists ── */
        .pt-ul,
        .pt-ol {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5em;
        }
        .pt-li {
          font-family: var(--font-body);
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--ink-soft);
          padding: .4em 0 .4em 1.75em;
          position: relative;
          border-bottom: 1px solid var(--rule);
        }
        .pt-li:last-child { border-bottom: none; }

        /* Bullet marker — red dot */
        .pt-li-bullet::before {
          content: '';
          position: absolute;
          left: 2px;
          top: .85em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--red);
        }

        /* Numbered marker */
        .pt-ol { counter-reset: pt-ol-counter; }
        .pt-li-number { counter-increment: pt-ol-counter; }
        .pt-li-number::before {
          content: counter(pt-ol-counter);
          position: absolute;
          left: 0;
          top: .4em;
          font-family: var(--font-ui);
          font-size: .75rem;
          font-weight: 700;
          color: var(--red);
          line-height: 1.75;
        }

        /* ── Inline marks ── */
        .pt-strong { font-weight: 700; color: var(--ink); }
        .pt-em     { font-style: italic; color: var(--ink-soft); }
        .pt-code {
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          font-size: .85em;
          background: var(--paper-warm);
          border: 1px solid var(--rule);
          padding: .12em .38em;
          border-radius: 3px;
          color: var(--red);
        }
        .pt-link {
          color: var(--ink);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
          text-decoration-color: var(--red);
          font-weight: 500;
          transition: color .12s;
        }
        .pt-link:hover { color: var(--red); }

        /* ── Read Also card ── */
        .pt-related {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin: 2.5em 0;
          padding: 20px 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          text-decoration: none;
          transition: border-color .15s;
        }
        .pt-related:hover { border-color: var(--red); }
        .pt-related-kicker {
          display: block;
          font-family: var(--font-ui);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 6px;
        }
        .pt-related-headline {
          font-family: var(--font-display);
          font-size: clamp(1rem, 2vw, 1.15rem);
          font-weight: 700;
          font-style: italic;
          line-height: 1.3;
          color: var(--ink);
          margin: 0;
          transition: color .12s;
        }
        .pt-related:hover .pt-related-headline { color: var(--red); }
        .pt-related-thumb {
          width: 90px;
          height: 68px;
          background: var(--paper-warm);
        }
        .pt-related-img { transition: transform .3s; }
        .pt-related:hover .pt-related-img { transform: scale(1.06); }

        /* ── Inline figure ── */
        .pt-figure { margin: 2.5em 0; }
        .pt-figure-ratio {
          aspect-ratio: 16/9;
        }
        .pt-figcaption {
          margin-top: 10px;
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--ink-muted);
          letter-spacing: .03em;
          padding-left: 10px;
          border-left: 2px solid var(--red);
        }
        .pt-credit {
          font-style: normal;
          font-weight: 700;
          color: var(--ink-faint);
        }

        /* ── YouTube ── */
        .pt-video { margin: 2.5em 0; }
        .pt-video-ratio {
          aspect-ratio: 16/9;
          box-shadow: 0 8px 32px rgba(0,0,0,.15);
        }
        .pt-video-caption {
          margin-top: 10px;
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--ink-muted);
          text-align: center;
          font-style: italic;
          letter-spacing: .03em;
        }

        /* ── HR inside body ── */
        .pt-root hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--rule), transparent);
          margin: 3em auto;
          width: 50%;
        }

        /* ── Pre / code blocks ── */
        .pt-root pre {
          background: var(--ink);
          border-radius: 8px;
          padding: 1.5em;
          overflow-x: auto;
          margin: 2em 0;
        }
        .pt-root pre code {
          background: none;
          border: none;
          color: #d6d3d1;
          font-size: .85rem;
          padding: 0;
        }
      `}</style>
    </>
  );
}
