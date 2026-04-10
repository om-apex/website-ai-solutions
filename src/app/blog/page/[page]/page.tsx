import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getAllCategories } from '@/lib/blog';
import { paginateArticles, ARTICLES_PER_PAGE, categorySlug } from '@/lib/blog-utils';
import BlogGrid from '@/components/blog/BlogGrid';
import Pagination from '@/components/blog/Pagination';
import BlogShell from '@/components/blog/BlogShell';

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
      'Insights on AI-native software for business and supply chain.',
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
    <BlogShell
      badge={`Insights · Page ${currentPage}`}
      title="Browse the full AI Solutions journal"
      description="The same editorial system, just later in the archive."
      backLink={
        <Link href="/blog" className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-primary">
          &larr; Back to the main journal
        </Link>
      }
      preContent={
        categories.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="rounded-full border border-[#234d7a] bg-[#234d7a] px-4 py-1.5 text-sm font-medium text-white shadow-sm"
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${categorySlug(cat)}`}
                className="rounded-full border border-[#c8d9ec] bg-[linear-gradient(180deg,#f7fbff_0%,#e6eff8_100%)] px-4 py-1.5 text-sm font-medium text-[#2d577f] transition-colors hover:border-[#a8c0db] hover:bg-[linear-gradient(180deg,#eef5fc_0%,#dfeaf6_100%)]"
              >
                {cat}
              </Link>
            ))}
          </div>
        ) : null
      }
    >
      <BlogGrid articles={items} />
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
    </BlogShell>
  );
}
