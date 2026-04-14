import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getPublishedArticles, getAllCategories, getAllSeries } from '@/lib/blog';
import { getSearchIndex } from '@/lib/search-index';
import { paginateArticles, categorySlug } from '@/lib/blog-utils';
import BlogGrid from '@/components/blog/BlogGrid';
import Pagination from '@/components/blog/Pagination';
import SearchDialog from '@/components/blog/SearchDialog';
import BlogShell from '@/components/blog/BlogShell';
import SeriesSpotlight from '@/components/blog/SeriesSpotlight';

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
  const series = getAllSeries();
  const searchIndex = getSearchIndex();
  const { items, totalPages, currentPage } = paginateArticles(articles, 1);

  const upcomingTracks = [
    {
      label: 'Announced Series',
      title: 'The AI-Ready Organization',
      description:
        'A practical framework for understanding what separates companies that are structurally ready for AI from those that are still improvising.',
    },
    {
      label: 'Product Thinking',
      title: 'AI Quorum',
      description:
        'Essays on multi-model debates, trust, and how serious AI users move from single-model answers to stronger outcomes.',
    },
    {
      label: 'Operating Practice',
      title: 'Agentic Tools',
      description:
        'Practical notes on how to use agentic systems effectively in business settings without getting lost in novelty or hype.',
    },
    {
      label: 'Platform Perspective',
      title: 'Om Cortex',
      description:
        'Thought pieces on the central intelligence layer behind connected business memory, tools, and governance.',
    },
  ];

  const activeSeries = series.map((entry) => ({
    label: `${entry.total} Parts`,
    title: entry.name,
    description: 'Read the full series in order, with grouped navigation and a consistent article flow.',
    href: `/blog/series/${entry.slug}`,
  }));

  const categoryChips =
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
    ) : null;

  return (
    <BlogShell
      badge="Insights"
      title="Thoughtful notes on AI-native software for business and supply chain"
      description="A focused stream of ideas, product thinking, and operating observations behind what Om AI Solutions is building."
      accent="Founder-led perspective, practical AI signal"
      searchSlot={<SearchDialog searchIndex={searchIndex} />}
      preContent={
        <div className="space-y-6">
          {activeSeries.length > 0 && (
            <SeriesSpotlight
              eyebrow="Reading Tracks"
              title="Start with the editorial collections"
              description="Browse by series when you want a tighter sequence instead of a flat list of articles."
              items={activeSeries}
            />
          )}
          <SeriesSpotlight
            eyebrow="Coming Into View"
            title="What this journal will cover"
            description="AI Solutions will publish around the practical operating questions behind AI-native software, not just commentary about the market."
            items={upcomingTracks}
          />
          {categoryChips}
        </div>
      }
    >
      {items.length === 0 ? (
        <div className="blog-shell-card rounded-[1.6rem] p-10 text-center shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8d9ec] bg-white px-4 py-1.5 text-sm font-medium text-brand-primary">
            <Search className="h-4 w-4" />
            First articles coming soon
          </div>
          <p className="mt-4 text-base text-slate-600">
            The editorial system is ready. The first published posts will appear here in the same format you see elsewhere in the site.
          </p>
        </div>
      ) : (
        <>
          <BlogGrid articles={items} />
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
        </>
      )}
    </BlogShell>
  );
}
