import { urlFor } from "@/lib/sanity/image";
import { PortableText, PortableTextComponents, PortableTextProps } from "@portabletext/react";
import Image from "next/image";

// 1. Define interfaces for our custom Sanity objects
interface InlineImageValue {
  _type: "inlineImage";
  alt?: string;
  caption?: string;
  attribution?: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
}

interface YouTubeValue {
  _type: "youtube";
  url: string;
  videoCaption?: string;
}

// 2. Define the components with strict typing
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-slate-900 leading-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-3 text-slate-800">{children}</h3>,
    normal: ({ children }) => <p className="text-lg leading-relaxed text-slate-700 mb-6 font-serif">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-pd-red pl-6 py-2 my-8 italic text-xl text-slate-800 bg-slate-50">
        {children}
      </blockquote>
    ),
  },
  types: {
    // value is now typed to our specific interface
    inlineImage: ({ value }: { value: InlineImageValue }) => (
      <figure className="my-10 space-y-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image 
            src={urlFor(value).url()} 
            alt={value.alt || "Kurunzi News Article Image"} 
            fill 
            className="object-cover" 
          />
        </div>
        {(value.caption || value.attribution) && (
          <figcaption className="text-sm text-slate-500 italic px-2">
            {value.caption} 
            {value.attribution && (
              <span className="font-bold uppercase text-[10px] ml-2 tracking-tighter">
                — {value.attribution}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    ),
    youtube: ({ value }: { value: YouTubeValue }) => {
      // Robust YouTube ID extraction
      const videoId = value.url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      
      if (!videoId) return null;

      return (
        <div className="my-10 space-y-2">
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
             <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Kurunzi News Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            />
          </div>
          {value.videoCaption && (
            <p className="text-center text-sm text-slate-500 italic">{value.videoCaption}</p>
          )}
        </div>
      );
    },
  },
};

// 3. Main component uses PortableTextProps['value']
export default function CustomPortableText({ value }: { value: PortableTextProps['value'] }) {
  return <PortableText value={value} components={components} />;
}