import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, CalendarDays, Clock3, NotebookPen } from 'lucide-react';
import {
  getArticleContent,
  getPublishedArticles,
  getArticleByPart,
} from '@/lib/blog';
import ArticleNavigator from '@/components/blog/ArticleNavigator';
import { createHeadingIdFactory, extractArticleHeadings } from '@/lib/blog-navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getArticleContent(slug);
  if (!result) return {};

  const { metadata } = result;
  return {
    title: `${metadata.title} | Om AI Solutions`,
    description: metadata.excerpt,
    openGraph: {
      title: metadata.title,
      description: metadata.excerpt,
      type: 'article',
      ...(metadata.headerImage ? { images: [{ url: metadata.headerImage }] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const result = getArticleContent(slug);

  if (!result || !result.metadata.published) {
    notFound();
  }

  const { metadata, content } = result;
  const headings = extractArticleHeadings(content);

  // Determine prev/next articles (for series articles)
  const currentPart = metadata.part ?? 0;
  const totalParts = metadata.seriesTotal ?? 0;
  const prev = currentPart > 1 ? getArticleByPart(currentPart - 1) : null;
  const next = currentPart > 0 && currentPart < totalParts ? getArticleByPart(currentPart + 1) : null;

  // Only link to published articles
  const prevLink = prev?.published ? prev : null;
  const nextLink = next?.published ? next : null;
  const seriesHref = metadata.series ? `/blog/series/${metadata.series.slug}` : undefined;
  const makeHeadingId = createHeadingIdFactory();

  const renderHeading = (tag: 'h2' | 'h3') =>
    function Heading({ children }: { children?: ReactNode }) {
      const text = flattenText(children);
      const id = makeHeadingId(text);
      const Tag = tag;

      return (
        <Tag id={id}>
          {children}
        </Tag>
      );
    };

  return (
    <main className="blog-site-shell min-h-[calc(100svh-80px)]">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/blog" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Insights
          </Link>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <article className="blog-shell-card overflow-hidden rounded-[2rem]">
              {metadata.headerImage && (
                <div className="relative aspect-[16/8] overflow-hidden">
                  <Image
                    src={metadata.headerImage}
                    alt={metadata.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 900px"
                    priority
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
                  {metadata.category !== 'Uncategorized' && (
                    <span className="blog-shell-pill rounded-full px-3 py-1">
                      {metadata.category}
                    </span>
                  )}
                  {metadata.seriesTitle && (
                    <span className="rounded-full border border-[rgba(30,77,124,0.12)] bg-white px-3 py-1">
                      {metadata.seriesTitle}
                    </span>
                  )}
                </div>

                <header className="mt-5">
                  <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                    {metadata.title}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <NotebookPen className="h-4 w-4" />
                      {metadata.author}
                    </span>
                    {metadata.date && (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <time dateTime={metadata.date}>
                          {new Date(metadata.date + 'T00:00:00').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {metadata.readingTime} min read
                    </span>
                  </div>
                </header>

                <div className="mt-6 xl:hidden">
                  <ArticleNavigator
                    compact
                    headings={headings}
                    series={metadata.series}
                    seriesHref={seriesHref}
                    previous={prevLink ? { slug: prevLink.slug, title: prevLink.title } : null}
                    next={nextLink ? { slug: nextLink.slug, title: nextLink.title } : null}
                  />
                </div>

                <hr className="blog-rule mt-8" />

                <div className="blog-prose mt-8">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h2: renderHeading('h2'),
                      h3: renderHeading('h3'),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>

                {(prevLink || nextLink) && (
                  <nav className="mt-12 grid gap-4 border-t border-[rgba(148,163,184,0.18)] pt-8 md:grid-cols-2">
                    {prevLink ? (
                      <Link
                        href={`/blog/${prevLink.slug}`}
                        className="group rounded-[1.35rem] border border-[rgba(148,163,184,0.18)] bg-white/75 p-4 transition-colors hover:border-brand-primary"
                      >
                        <span className="text-sm text-slate-500 group-hover:text-brand-primary">
                          &larr; Previous
                        </span>
                        <p className="mt-2 text-sm font-medium text-slate-900 group-hover:text-brand-primary">
                          {prevLink.title}
                        </p>
                      </Link>
                    ) : (
                      <div />
                    )}
                    {nextLink ? (
                      <Link
                        href={`/blog/${nextLink.slug}`}
                        className="group rounded-[1.35rem] border border-[rgba(148,163,184,0.18)] bg-white/75 p-4 text-left transition-colors hover:border-brand-primary md:text-right"
                      >
                        <span className="text-sm text-slate-500 group-hover:text-brand-primary">
                          Next &rarr;
                        </span>
                        <p className="mt-2 text-sm font-medium text-slate-900 group-hover:text-brand-primary">
                          {nextLink.title}
                        </p>
                      </Link>
                    ) : (
                      <div />
                    )}
                  </nav>
                )}
              </div>
            </article>

            <ArticleNavigator
              className="hidden xl:block"
              headings={headings}
              series={metadata.series}
              seriesHref={seriesHref}
              previous={prevLink ? { slug: prevLink.slug, title: prevLink.title } : null}
              next={nextLink ? { slug: nextLink.slug, title: nextLink.title } : null}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function flattenText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(flattenText).join(' ');
  }

  if (children && typeof children === 'object' && 'props' in children) {
    const child = children as { props?: { children?: ReactNode } };
    return flattenText(child.props?.children ?? '');
  }

  return '';
}
