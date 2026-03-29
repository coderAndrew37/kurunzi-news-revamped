import Image from "next/image";

interface SkeletonImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function SkeletonImage({
  src,
  alt,
  caption,
  credit,
  className,
  priority,
}: SkeletonImageProps & { caption?: string; credit?: string }) {
  if (!src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-200 ${className}`}
      >
        <div className="flex items-center gap-2 opacity-20">
          <div className="w-8 h-1 bg-red-600 animate-pulse" />
          <span className="text-xs font-black tracking-widest text-gray-400 uppercase">
            Kurunzi Sports
          </span>
        </div>
      </div>
    );
  }

  return (
    <figure className="w-full">
      <div className="relative overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover ${className}`}
        />
      </div>

      {/* CAPTION & CREDIT BLOCK */}
      {(caption || credit) && (
        <figcaption className="mt-3 text-sm leading-relaxed text-gray-600 border-l-2 border-red-600 pl-4">
          {caption && (
            <div
              className="italic font-medium"
              dangerouslySetInnerHTML={{ __html: caption }}
            />
          )}
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
