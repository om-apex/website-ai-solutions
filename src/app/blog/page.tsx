import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPublishedArticles } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Om AI Solutions',
  description:
    'AI in Supply Chain — a 10-part article series exploring how artificial intelligence is transforming supply chain operations.',
  openGraph: {
    title: 'Blog | Om AI Solutions',
    description:
      'AI in Supply Chain — a 10-part article series exploring how artificial intelligence is transforming supply chain operations.',
  },
};

export default function BlogPage() {
  const articles = getPublishedArticles();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-4">
          AI in Supply Chain
        </h1>
        <p className="text-lg text-gray-600">
          A {articles[0]?.seriesTotal ?? 10}-part series exploring how artificial
          intelligence is transforming supply chain operations — from strategy to
          execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group block"
          >
            <article className="blog-card rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={article.headerImage}
                  alt={article.seriesTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="blog-part-badge inline-block px-3 py-1 text-xs font-bold text-white rounded-full">
                    Part {article.part}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-brand-primary font-medium mb-1">
                  {article.seriesTitle}
                </p>
                <h2 className="text-base font-semibold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2">
                  {article.subtitle}
                </h2>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
