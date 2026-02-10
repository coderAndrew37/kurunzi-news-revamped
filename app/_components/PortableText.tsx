import { urlFor } from "@/lib/sanity/image";
import {
  PortableText,
  PortableTextComponents,
  PortableTextProps,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

// 1. Interfaces for Sanity objects
interface InlineImageValue {
  _type: "inlineImage";
  alt?: string;
  caption?: string;
  attribution?: string;
  asset?: {
    _ref: string;
    _type: "reference";
  };
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

// 2. Component Definitions
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-10 mb-4 text-slate-900 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-8 mb-3 text-slate-800">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-lg leading-relaxed text-slate-700 mb-6 font-serif">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-pd-red pl-6 py-2 my-8 italic text-xl text-slate-800 bg-slate-50">
        {children}
      </blockquote>
    ),
  },
  types: {
    // --- INLINE RELATED ARTICLE (Two Column: Text Left, Image Right) ---
    inlineRelated: ({ value }: { value: InlineRelatedValue }) => {
      if (!value?.post?.slug) return null;

      return (
        <Link
          href={`/${value.post.categorySlug}/${value.post.slug}`}
          className="group my-10 block overflow-hidden border-y border-slate-200 py-6 transition-all hover:border-pd-red"
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-pd-red">
                Read Also
              </span>
              <h4 className="text-xl md:text-2xl font-bold leading-tight text-slate-900 group-hover:text-pd-red transition-colors italic">
                {value.post.title}
              </h4>
            </div>

            {value.post.mainImage && (
              <div className="relative h-20 w-20 md:h-24 md:w-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-sm">
                <Image
                  src={urlFor(value.post.mainImage)
                    .width(300)
                    .height(200)
                    .url()}
                  alt={value.post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            )}
          </div>
        </Link>
      );
    },

    // --- INLINE IMAGE ---
    inlineImage: ({ value }: { value: InlineImageValue }) => {
      // 1. Strict Guard: Check if the asset and its reference ID exist
      // This prevents urlFor(value) from throwing an error
      if (!value?.asset?._ref) {
        console.error(
          "Inline Image block skipped: Missing asset reference",
          value,
        );
        return null;
      }

      return (
        <figure className="my-10 space-y-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md bg-slate-100">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Article Image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              className="object-cover"
            />
          </div>
          {(value.caption || value.attribution) && (
            <figcaption className="text-sm text-slate-500 italic px-2 border-l-2 border-pd-red ml-1">
              {value.caption}
              {value.attribution && (
                <span className="font-bold uppercase text-[10px] ml-2 tracking-tighter not-italic text-slate-400">
                  — {value.attribution}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      );
    },

    // --- YOUTUBE ---
    youtube: ({ value }: { value: YouTubeValue }) => {
      const videoId = value.url?.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/,
      )?.[1];
      if (!videoId) return null;

      return (
        <div className="my-10 space-y-3">
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Video Content"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            />
          </div>
          {value.videoCaption && (
            <p className="text-center text-sm text-slate-500 italic font-medium">
              {value.videoCaption}
            </p>
          )}
        </div>
      );
    },
  },
};

export default function CustomPortableText({
  value,
}: {
  value: PortableTextProps["value"];
}) {
  if (!value) return null;

  return (
    <div
      className="prose prose-slate max-w-none 
      prose-p:text-lg prose-p:leading-relaxed prose-p:font-serif prose-p:text-slate-700
      prose-headings:font-black prose-headings:text-slate-900"
    >
      <PortableText value={value} components={components} />
    </div>
  );
}
