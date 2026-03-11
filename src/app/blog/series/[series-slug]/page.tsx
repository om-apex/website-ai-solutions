import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getAllSeries } from '@/lib/blog';

interface PageProps {
  params: Promise<{ 'series-slug': string }>;
}

export async function generateStaticParams() {
  const seriesList = getAllSeries();
  return seriesList.map((s) => ({ 'series-slug': s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'series-slug': slug } = await params;
  const seriesList = getAllSeries();
  const series = seriesList.find((s) => s.slug === slug);
  const name = series?.name ?? slug;

  return {
    title: `${name} Series | Blog | Om AI Solutions`,
    description: `Read the complete ${name} series from Om AI Solutions.`,
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { 'series-slug': slug } = await params;
  const seriesList = getAllSeries();
  const series = seriesList.find((s) => s.slug === slug);

  if (!series) {
    notFound();
  }

  const articles = getPublishedArticles()
    .filter((a) => a.series?.slug === slug)
    .sort((a, b) => (a.series?.part ?? 0) - (b.series?.part ?? 0));

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-brand-primary transition-colors mb-4 inline-block">
          &larr; All Articles
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
          {series.name}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {articles.length} part{articles.length !== 1 ? 's' : ''} &middot; {series.total} total in series
        </p>

        <ol className="space-y-4">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/blog/${article.slug}`}
                className="group flex gap-4 p-4 rounded-lg border hover:border-brand-primary hover:shadow-sm transition-all"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold">
                  {article.series?.part}
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-1">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <span className="text-xs text-gray-400 mt-1 inline-block">
                    {article.readingTime} min read
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
