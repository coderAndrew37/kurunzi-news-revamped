import SanityImage from "@/app/_components/SanityImage"; // Import your new component
import ArticleLink from "@/app/_components/ArticleLink";
import { NewsCardProps } from "@/types";

interface NewsSectionProps {
  title: string;
  posts: NewsCardProps[];
}

export default function NewsSection({ title, posts }: NewsSectionProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const subFeatures = posts.slice(1, 3);
  const sidebarPosts = posts.slice(3, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-black uppercase whitespace-nowrap">
          {title}
        </h2>
        <div className="h-[3px] w-full bg-pd-green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SIDE: Main & Sub-features */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ArticleLink
            categorySlug={mainPost.category}
            slug={mainPost.slug}
            className="group relative block"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
              {/* Swapped Image for SanityImage */}
              <SanityImage
                asset={mainPost.image}
                alt={mainPost.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 bg-pd-red text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase">
                {mainPost.category}
              </span>
            </div>
            <h3 className="mt-4 text-2xl md:text-3xl font-bold leading-tight group-hover:text-pd-red transition-colors">
              {mainPost.title}
            </h3>
            {mainPost.excerpt && (
              <p className="mt-2 text-slate-600 line-clamp-2 text-sm md:text-base">
                {mainPost.excerpt}
              </p>
            )}
          </ArticleLink>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subFeatures.map((post) => (
              <ArticleLink
                key={post.slug}
                categorySlug={post.category}
                slug={post.slug}
                className="group"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg mb-3 bg-slate-100">
                  {/* Swapped Image for SanityImage */}
                  <SanityImage
                    asset={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-pd-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {post.category}
                  </span>
                </div>
                <h4 className="text-lg font-bold leading-snug group-hover:text-pd-red transition-colors">
                  {post.title}
                </h4>
              </ArticleLink>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Sidebar List */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l lg:pl-8 pt-6 lg:pt-0">
          <div className="flex flex-col gap-5">
            {sidebarPosts.map((post, idx) => (
              <ArticleLink
                key={post.slug}
                categorySlug={post.category}
                slug={post.slug}
                className={`flex gap-4 pb-4 group ${
                  idx !== sidebarPosts.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <div className="flex-1">
                  <span className="text-pd-green text-[10px] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h5 className="font-bold text-sm leading-tight group-hover:text-pd-red transition-colors mt-1 line-clamp-3">
                    {post.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {post.date}
                  </p>
                </div>
                <div className="relative w-24 h-18 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                  {/* Swapped Image for SanityImage */}
                  <SanityImage
                    asset={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </ArticleLink>
            ))}

            <button className="mt-4 w-full md:w-fit bg-pd-red text-white font-black text-sm py-3 px-8 rounded transition-all active:scale-95 hover:bg-black uppercase tracking-tighter">
              CLICK FOR MORE {title}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
