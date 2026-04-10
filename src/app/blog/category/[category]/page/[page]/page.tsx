import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getAllCategories } from '@/lib/blog';
import {
  paginateArticles,
  ARTICLES_PER_PAGE,
  categorySlug,
  categoryFromSlug,
} from '@/lib/blog-utils';
import BlogGrid from '@/components/blog/BlogGrid';
import Pagination from '@/components/blog/Pagination';
import BlogShell from '@/components/blog/BlogShell';

interface PageProps {
  params: Promise<{ category: string; page: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  const articles = getPublishedArticles();
  const params: { category: string; page: string }[] = [];

  for (const cat of categories) {
    const filtered = articles.filter((a) => a.category === cat);
    const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
    for (let p = 2; p <= totalPages; p++) {
      params.push({ category: categorySlug(cat), page: String(p) });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug, page } = await params;
  const categories = getAllCategories();
  const name = categoryFromSlug(slug, categories) ?? slug;

  return {
    title: `${name} — Page ${page} | Blog | Om AI Solutions`,
    description: `Articles about ${name} from Om AI Solutions.`,
  };
}

export default async function CategoryPaginatedPage({ params }: PageProps) {
  const { category: slug, page: pageStr } = await params;
  const pageNum = parseInt(pageStr, 10);

  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }

  const categories = getAllCategories();
  const name = categoryFromSlug(slug, categories);

  if (!name) {
    notFound();
  }

  const allArticles = getPublishedArticles().filter(
    (a) => a.category === name
  );
  const { items, totalPages, currentPage } = paginateArticles(allArticles, pageNum);

  if (currentPage !== pageNum || items.length === 0) {
    notFound();
  }

  return (
    <BlogShell
      badge={`Topic · Page ${currentPage}`}
      title={name}
      description={`${allArticles.length} article${allArticles.length !== 1 ? 's' : ''} filed under this subject.`}
      backLink={
        <Link href={`/blog/category/${slug}`} className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-primary">
          &larr; Back to {name}
        </Link>
      }
      preContent={
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="rounded-full border border-[#c8d9ec] bg-[linear-gradient(180deg,#f7fbff_0%,#e6eff8_100%)] px-4 py-1.5 text-sm font-medium text-[#2d577f] transition-colors hover:border-[#a8c0db] hover:bg-[linear-gradient(180deg,#eef5fc_0%,#dfeaf6_100%)]"
          >
            All
          </Link>
          {categories.map((category) => {
            const href = `/blog/category/${categorySlug(category)}`;
            const active = category === name;

            return (
              <Link
                key={category}
                href={href}
                className={active
                  ? 'rounded-full border border-[#234d7a] bg-[#234d7a] px-4 py-1.5 text-sm font-medium text-white shadow-sm'
                  : 'rounded-full border border-[#c8d9ec] bg-[linear-gradient(180deg,#f7fbff_0%,#e6eff8_100%)] px-4 py-1.5 text-sm font-medium text-[#2d577f] transition-colors hover:border-[#a8c0db] hover:bg-[linear-gradient(180deg,#eef5fc_0%,#dfeaf6_100%)]'}
              >
                {category}
              </Link>
            );
          })}
        </div>
      }
    >
      <BlogGrid articles={items} showCategoryChips={false} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/category/${slug}`}
      />
    </BlogShell>
  );
}
