import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface ArticleLinkProps extends Omit<LinkProps, "href"> {
  // Made categorySlug optional in case you want to link directly to /posts/slug
  categorySlug?: string;
  slug: string;
  children: ReactNode;
  className?: string;
}

/**
 * Custom Link component for Kurunzi Sports.
 * Standardizes how we generate URLs for WordPress posts.
 */
export default function ArticleLink({
  categorySlug,
  slug,
  children,
  className,
  ...props
}: ArticleLinkProps) {
  // Logic to build the URL.
  // If your routing is /[category]/[slug], use the first version.
  // If it's just /article/[slug], use the second.
  const href = categorySlug
    ? `/${categorySlug.toLowerCase()}/${slug}`
    : `/article/${slug}`;

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
