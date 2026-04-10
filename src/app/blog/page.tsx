import type { Metadata } from 'next';
import Link from 'next/link';
import { NotebookPen, Search, Sparkles } from 'lucide-react';
import { getPublishedArticles, getAllCategories } from '@/lib/blog';
import { getSearchIndex } from '@/lib/search-index';
import { paginateArticles, categorySlug } from '@/lib/blog-utils';
import BlogGrid from '@/components/blog/BlogGrid';
import Pagination from '@/components/blog/Pagination';
import SearchDialog from '@/components/blog/SearchDialog';

export const metadata: Metadata = {
  title: 'Blog | Om AI Solutions',
  description:
    'Insights on AI-powered solutions for modern business operations.',
  openGraph: {
    title: 'Blog | Om AI Solutions',
    description:
      'Insights on AI-powered solutions for modern business operations.',
  },
};

export default function BlogPage() {
  const articles = getPublishedArticles();
  const categories = getAllCategories();
  const searchIndex = getSearchIndex();
  const { items, totalPages, currentPage } = paginateArticles(articles, 1);

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[linear-gradient(135deg,#edf4fb_0%,#deebf7_54%,#d4e4f3_100%)]">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto mb-10 max-w-5xl rounded-[2rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,rgba(248,252,255,0.94)_0%,rgba(231,240,249,0.9)_100%)] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b9cae0] bg-[linear-gradient(180deg,rgba(219,231,244,0.96)_0%,rgba(203,220,239,0.9)_100%)] px-4 py-1.5 text-[11px] font-medium tracking-[0.02em] text-[#234d7a] shadow-sm">
                <NotebookPen className="h-3.5 w-3.5" />
                Insights
              </div>
              <h1 className="mt-4 text-4xl font-bold text-slate-950 md:text-5xl">
                Thoughtful notes on AI-native software for business and supply chain
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                A focused stream of ideas, product thinking, and operating observations behind what Om AI Solutions is building.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-primary">
                <Sparkles className="h-4 w-4" />
                Founder-led perspective, practical AI signal
              </div>
            </div>

            <div className="flex shrink-0 justify-start lg:justify-end">
              <SearchDialog searchIndex={searchIndex} />
            </div>
          </div>
        </div>

        {categories.length > 1 && (
          <div className="mx-auto mb-8 flex max-w-5xl flex-wrap gap-2">
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
        )}

        {items.length === 0 ? (
          <div className="mx-auto max-w-5xl rounded-[1.6rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,#f7fbff_0%,#e9f1fa_100%)] p-10 text-center shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c8d9ec] bg-white px-4 py-1.5 text-sm font-medium text-brand-primary">
              <Search className="h-4 w-4" />
              No posts yet
            </div>
            <p className="mt-4 text-base text-slate-600">
              The visual system is ready. The first Insights articles can drop into this layout as soon as you are ready to publish them.
            </p>
          </div>
        ) : (
          <BlogGrid articles={items} />
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
      </div>
    </main>
  );
}
