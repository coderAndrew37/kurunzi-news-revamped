// app/_components/SanityImage.tsx
import Image, { ImageProps } from "next/image";

interface Props extends Omit<ImageProps, "src"> {
  asset: string | any; // asset is now likely the URL string from the mapper
}

export default function SanityImage({
  asset,
  alt,
  width,
  height,
  fill,
  ...props
}: Props) {
  if (!asset) return <div className="bg-slate-200 w-full h-full" />;

  // Logic: If the mapper gave us a string, use it.
  // If it's still an object (raw sanity data), we can't resolve it on the client without NEXT_PUBLIC vars.
  const imageUrl = typeof asset === "string" ? asset : "/fallback-news.jpg";

  const imageProps = fill
    ? { fill, ...props }
    : { width: width || 800, height: height || 450, ...props };

  return (
    <Image
      src={imageUrl}
      alt={alt || "Kurunzi News"}
      {...imageProps}
      unoptimized={imageUrl.includes("cdn.sanity.io")} // Good for private/signed URLs
    />
  );
}
