import Link, { LinkProps } from "next/link";
import { getArticleUrl } from "@/lib/utils/urls";
import { ReactNode } from "react";

interface ArticleLinkProps extends Omit<LinkProps, 'href'> {
  categorySlug: string;
  slug: string;
  children: ReactNode;
  className?: string;
}

export default function ArticleLink({ 
  categorySlug, 
  slug, 
  children, 
  className, 
  ...props 
}: ArticleLinkProps) {
  return (
    <Link 
      href={getArticleUrl(categorySlug, slug)} 
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}