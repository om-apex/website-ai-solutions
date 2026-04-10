import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getAllSeries } from '@/lib/blog';
import BlogShell from '@/components/blog/BlogShell';

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
    <BlogShell
      badge="Series"
      title={series.name}
      description={`${articles.length} part${articles.length !== 1 ? 's' : ''} currently published, arranged in reading order.`}
      backLink={
        <Link href="/blog" className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-primary">
          &larr; Back to the journal
        </Link>
      }
    >
      <ol className="space-y-4">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="group flex gap-4 rounded-[1.4rem] border border-[rgba(30,77,124,0.12)] bg-[linear-gradient(180deg,rgba(248,252,255,0.96)_0%,rgba(233,241,250,0.92)_100%)] p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-[0_20px_44px_rgba(15,23,42,0.08)]"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white shadow-sm">
                {article.series?.part}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>{article.author}</span>
                  <span>&middot;</span>
                  <span>{article.readingTime} min read</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 transition-colors group-hover:text-brand-primary">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </BlogShell>
  );
}
