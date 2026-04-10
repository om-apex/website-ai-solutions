import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getAllCategories } from '@/lib/blog';
import { paginateArticles, categorySlug, categoryFromSlug } from '@/lib/blog-utils';
import BlogGrid from '@/components/blog/BlogGrid';
import Pagination from '@/components/blog/Pagination';
import BlogShell from '@/components/blog/BlogShell';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ category: categorySlug(cat) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = getAllCategories();
  const name = categoryFromSlug(slug, categories) ?? slug;

  return {
    title: `${name} | Blog | Om AI Solutions`,
    description: `Articles about ${name} from Om AI Solutions.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const categories = getAllCategories();
  const name = categoryFromSlug(slug, categories);

  if (!name) {
    notFound();
  }

  const allArticles = getPublishedArticles().filter(
    (a) => a.category === name
  );
  const { items, totalPages, currentPage } = paginateArticles(allArticles, 1);

  return (
    <BlogShell
      badge="Topic"
      title={name}
      description={`${allArticles.length} article${allArticles.length !== 1 ? 's' : ''} filed under this subject.`}
      backLink={
        <Link href="/blog" className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-primary">
          &larr; All Articles
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
          {getAllCategories().map((category) => {
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
