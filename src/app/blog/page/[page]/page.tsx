import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getAllCategories } from '@/lib/blog';
import { paginateArticles, ARTICLES_PER_PAGE, categorySlug } from '@/lib/blog-utils';
import BlogGrid from '@/components/blog/BlogGrid';
import Pagination from '@/components/blog/Pagination';

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const articles = getPublishedArticles();
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);

  // Page 1 is handled by /blog, so start from 2
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Blog — Page ${page} | Om AI Solutions`,
    description:
      'Insights on supply chain strategy, AI in logistics, warehouse optimization, and digital transformation.',
  };
}

export default async function BlogPaginatedPage({ params }: PageProps) {
  const { page: pageStr } = await params;
  const pageNum = parseInt(pageStr, 10);

  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }

  const articles = getPublishedArticles();
  const categories = getAllCategories();
  const { items, totalPages, currentPage } = paginateArticles(articles, pageNum);

  if (currentPage !== pageNum || items.length === 0) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-4">
          Blog
        </h1>
        <p className="text-lg text-gray-600">
          Insights on supply chain strategy, AI, and warehouse optimization.
        </p>
      </div>

      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="px-4 py-1.5 text-sm font-medium rounded-full bg-brand-primary text-white"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog/category/${categorySlug(cat)}`}
              className="px-4 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      <BlogGrid articles={items} />
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
    </main>
  );
}
