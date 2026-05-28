"use client";
import Image from "next/image";

interface SkeletonImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  caption?: string;
  credit?: string;
}

export default function SkeletonImage({
  src,
  alt,
  className = "",
  priority = false,
  caption,
  credit,
}: SkeletonImageProps) {

  // Use native <img> in development, next/image in production
  const isDev = process.env.NODE_ENV === "development";

  if (!src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#f7f4f0] border border-[#e8e2da] aspect-[16/9] ${className}`}
      >
        <div className="flex items-center gap-2 opacity-30">
          <div className="w-8 h-1 bg-red-600 animate-pulse" />
          <span className="text-xs font-black tracking-widest text-gray-400 uppercase">
            Kurunzi Sports
          </span>
        </div>
      </div>
    );
  }

  // Development: Use regular <img> tag (bypasses localhost restrictions)
  if (isDev) {
    return (
      <figure className="w-full relative">
        <div className="relative overflow-hidden bg-[#f7f4f0] aspect-[16/9] rounded-sm">
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition duration-500 hover:scale-105 ${className}`}
            loading={priority ? "eager" : "lazy"}
          />
        </div>

        {/* Caption & Credit */}
        {(caption || credit) && (
          <figcaption className="mt-3 text-sm leading-relaxed text-gray-600 border-l-2 border-red-600 pl-4">
            {caption && <div dangerouslySetInnerHTML={{ __html: caption }} />}
            {credit && (
              <span className="block text-[10px] uppercase tracking-wider text-gray-400 mt-1">
                Photo by: {credit}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    );
  }

  // Production: Use Next.js Image (optimized)
  return (
    <figure className="w-full relative">
      <div className="relative overflow-hidden bg-[#f7f4f0] aspect-[16/9] rounded-sm">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover transition duration-500 hover:scale-105 ${className}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Caption & Credit */}
      {(caption || credit) && (
        <figcaption className="mt-3 text-sm leading-relaxed text-gray-600 border-l-2 border-red-600 pl-4">
          {caption && <div dangerouslySetInnerHTML={{ __html: caption }} />}
          {credit && (
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 mt-1">
              Photo by: {credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
