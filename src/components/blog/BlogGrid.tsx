import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/types/blog';

interface BlogGridProps {
  articles: Article[];
  showCategoryChips?: boolean;
}

export default function BlogGrid({ articles, showCategoryChips = true }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/blog/${article.slug}`}
          className="group block"
        >
          <article className="flex h-full flex-col overflow-hidden rounded-[1.45rem] border border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,rgba(248,252,255,0.96)_0%,rgba(233,241,250,0.92)_100%)] shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.09)]">
            {article.headerImage && (
              <div className="relative aspect-[2/1] overflow-hidden">
                <Image
                  src={article.headerImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {article.series && (
                  <div className="absolute top-3 left-3">
                    <span className="blog-part-badge inline-block rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm">
                      Part {article.series.part}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              {article.series && (
                <p className="mb-1 text-sm font-medium text-brand-primary">
                  {article.series.name}
                </p>
              )}
              <h2 className="line-clamp-2 text-lg font-semibold text-slate-950 transition-colors group-hover:text-brand-primary">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {showCategoryChips && article.category !== 'Uncategorized' && (
                  <span className="rounded-full border border-[#d0deed] bg-white px-2.5 py-1 text-[#46698e]">
                    {article.category}
                  </span>
                )}
                <span>{article.author}</span>
                <span>&middot;</span>
                <span>{article.readingTime} min read</span>
                {article.date && (
                  <>
                    <span>&middot;</span>
                    <span>{new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}</span>
                  </>
                )}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
