import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/types/blog';

interface BlogGridProps {
  articles: Article[];
  showCategoryChips?: boolean;
}

export default function BlogGrid({ articles, showCategoryChips = true }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/blog/${article.slug}`}
          className="group block"
        >
          <article className="blog-card overflow-hidden rounded-[1.35rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,#f7fbff_0%,#e9f1fa_100%)] shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.09)]">
            {article.headerImage && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={article.headerImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {article.series && (
                  <div className="absolute top-3 left-3">
                    <span className="blog-part-badge inline-block px-3 py-1 text-xs font-bold text-white rounded-full">
                      Part {article.series.part}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="p-5">
              {article.series && (
                <p className="mb-1 text-sm font-medium text-brand-primary">
                  {article.series.name}
                </p>
              )}
              <h2 className="line-clamp-2 text-base font-semibold text-slate-950 transition-colors group-hover:text-brand-primary">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                {showCategoryChips && article.category !== 'Uncategorized' && (
                  <span className="rounded-full border border-[#d0deed] bg-white px-2 py-0.5 text-[#46698e]">{article.category}</span>
                )}
                <span>{article.readingTime} min read</span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
