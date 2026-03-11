import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
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

  // Determine prev/next articles (for series articles)
  const currentPart = metadata.part ?? 0;
  const totalParts = metadata.seriesTotal ?? 0;
  const prev = currentPart > 1 ? getArticleByPart(currentPart - 1) : null;
  const next = currentPart > 0 && currentPart < totalParts ? getArticleByPart(currentPart + 1) : null;

  // Only link to published articles
  const prevLink = prev?.published ? prev : null;
  const nextLink = next?.published ? next : null;

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        {/* Header Image */}
        {metadata.headerImage && (
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-6">
            <Image
              src={metadata.headerImage}
              alt={metadata.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Horizontal Rule */}
        <hr className="blog-rule" />

        {/* Article Header */}
        <header className="mb-8">
          {metadata.seriesTitle && (
            <p className="text-sm text-brand-primary font-medium mb-2">
              {metadata.seriesTitle}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">
            {metadata.title}
          </h1>
          <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
            <span>{metadata.author}</span>
            {metadata.date && (
              <>
                <span>&middot;</span>
                <time dateTime={metadata.date}>
                  {new Date(metadata.date + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </time>
              </>
            )}
            <span>&middot;</span>
            <span>{metadata.readingTime} min read</span>
          </div>
        </header>

        {/* Article Body */}
        <div className="blog-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Prev/Next Navigation */}
        {(prevLink || nextLink) && (
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
                  {prevLink.title}
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
                  {nextLink.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        )}
      </article>
    </main>
  );
}
