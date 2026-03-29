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
  className,
  priority,
}: SkeletonImageProps) {
  if (!src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-200 ${className}`}
      >
        {/* Kurunzi Branded Icon/Logo Placeholder */}
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
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
