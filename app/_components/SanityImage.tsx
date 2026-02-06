import Image, { ImageProps } from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { SanityImage as SanityImageType } from "@/types";

interface Props extends Omit<ImageProps, "src"> {
  asset: SanityImageType | string | any;
  width?: number;
  height?: number;
}

export default function SanityImage({
  asset,
  alt,
  width,
  height,
  ...props
}: Props) {
  // 1. Handle cases where the asset might be missing
  if (!asset) {
    return (
      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs italic">
        No Image Available
      </div>
    );
  }

  // 2. Resolve the URL.
  // If it's already a string (from the mapper), use it.
  // If it's a Sanity object, use urlFor to build the URL.
  let imageUrl = "";

  try {
    if (typeof asset === "string") {
      imageUrl = asset;
    } else {
      imageUrl = urlFor(asset)
        .width(width || 800)
        .height(height || 450)
        .auto("format")
        .url();
    }
  } catch (error) {
    console.error("Error resolving Sanity Image:", error);
    imageUrl = "/fallback-news.jpg"; // Your local fallback
  }

  return (
    <Image
      src={imageUrl}
      alt={alt || "Kurunzi News Image"}
      width={width || 800}
      height={height || 450}
      {...props}
    />
  );
}
