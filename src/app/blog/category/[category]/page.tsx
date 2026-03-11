import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getAllCategories } from '@/lib/blog';
import { paginateArticles, categorySlug, categoryFromSlug } from '@/lib/blog-utils';
import BlogGrid from '@/components/blog/BlogGrid';
import Pagination from '@/components/blog/Pagination';

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
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-brand-primary transition-colors mb-4 inline-block">
          &larr; All Articles
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">
          {name}
        </h1>
        <p className="text-lg text-gray-600">
          {allArticles.length} article{allArticles.length !== 1 ? 's' : ''}
        </p>
      </div>

      <BlogGrid articles={items} showCategoryChips={false} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/category/${slug}`}
      />
    </main>
  );
}
