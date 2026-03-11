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
          <article className="blog-card rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
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
                <p className="text-sm text-brand-primary font-medium mb-1">
                  {article.series.name}
                </p>
              )}
              <h2 className="text-base font-semibold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                {showCategoryChips && article.category !== 'Uncategorized' && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full">{article.category}</span>
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
