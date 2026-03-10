import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getArticleContent,
  getPublishedArticles,
  getArticleByPart,
} from '@/lib/blog';

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
    title: `${metadata.subtitle} | Om AI Solutions`,
    description: `${metadata.seriesTitle} — ${metadata.subtitle}`,
    openGraph: {
      title: metadata.subtitle,
      description: `${metadata.seriesTitle} — ${metadata.subtitle}`,
      type: 'article',
      images: [{ url: metadata.headerImage }],
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

  // Determine prev/next articles
  const prev = metadata.part > 1 ? getArticleByPart(metadata.part - 1) : null;
  const next =
    metadata.part < metadata.seriesTotal
      ? getArticleByPart(metadata.part + 1)
      : null;

  // Only link to published articles
  const prevLink = prev?.published ? prev : null;
  const nextLink = next?.published ? next : null;

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        {/* Header Image */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-6">
          <Image
            src={metadata.headerImage}
            alt={metadata.seriesTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {/* Blue Horizontal Rule */}
        <hr className="blog-rule" />

        {/* Article Header */}
        <header className="mb-8">
          <p className="text-sm text-brand-primary font-medium mb-2">
            {metadata.seriesTitle}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">
            {metadata.subtitle}
          </h1>
        </header>

        {/* Article Body */}
        <div className="blog-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom rendering for divs (callout blocks from pre-processing)
              div: ({ className, children, ...props }) => {
                if (className?.includes('callout')) {
                  return (
                    <div className={className} {...props}>
                      {children}
                    </div>
                  );
                }
                return <div className={className} {...props}>{children}</div>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Prev/Next Navigation */}
        <nav className="mt-12 pt-8 border-t flex justify-between items-start gap-4">
          {prevLink ? (
            <Link
              href={`/blog/${prevLink.slug}`}
              className="group flex-1 text-left"
            >
              <span className="text-sm text-gray-500 group-hover:text-brand-primary">
                &larr; Previous
              </span>
              <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary mt-1">
                {prevLink.subtitle}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextLink ? (
            <Link
              href={`/blog/${nextLink.slug}`}
              className="group flex-1 text-right"
            >
              <span className="text-sm text-gray-500 group-hover:text-brand-primary">
                Next &rarr;
              </span>
              <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary mt-1">
                {nextLink.subtitle}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>
    </main>
  );
}
