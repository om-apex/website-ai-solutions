import Link from 'next/link';
import { ArrowLeft, ArrowRight, List, MessagesSquare, Sparkles } from 'lucide-react';
import type { ArticleHeading } from '@/lib/blog-navigation';
import type { ArticleSeries } from '@/types/blog';
import { cn } from '@/lib/utils';

interface ArticleLink {
  slug: string;
  title: string;
}

interface ArticleNavigatorProps {
  headings: ArticleHeading[];
  series?: ArticleSeries;
  seriesHref?: string;
  discussionHref?: string;
  previous?: ArticleLink | null;
  next?: ArticleLink | null;
  compact?: boolean;
  className?: string;
}

export default function ArticleNavigator({
  headings,
  series,
  seriesHref,
  discussionHref,
  previous,
  next,
  compact = false,
  className,
}: ArticleNavigatorProps) {
  if (!headings.length && !series && !previous && !next && !discussionHref) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn('blog-shell-card rounded-[1.4rem] p-4', className)}>
        {discussionHref && (
          <div className={cn(headings.length > 0 && 'mb-4')}>
            <a
              href={discussionHref}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(30,77,124,0.12)] bg-[rgba(30,77,124,0.05)] px-3 py-1.5 text-sm font-medium text-brand-primary transition-colors hover:border-brand-primary hover:bg-[rgba(30,77,124,0.08)]"
            >
              <MessagesSquare className="h-4 w-4" />
              Discussion
            </a>
          </div>
        )}

        {headings.length > 0 && (
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
              <List className="h-3.5 w-3.5" />
              Jump Through The Article
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={cn(
                    'whitespace-nowrap rounded-full border border-[rgba(148,163,184,0.18)] bg-white px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-brand-primary hover:text-brand-primary',
                    heading.level === 3 && 'ml-3'
                  )}
                >
                  {heading.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {series && (
          <div className={cn(headings.length > 0 && 'mt-4 border-t border-[rgba(148,163,184,0.18)] pt-4')}>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
              Series Progress
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Part {series.part} of {series.total}
            </p>
            {seriesHref && (
              <Link href={seriesHref} className="mt-2 inline-flex text-sm font-medium text-brand-primary hover:text-brand-primary-dark">
                View the full series
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className={cn('sticky top-28 space-y-4', className)}>
      {discussionHref && (
        <div className="blog-shell-card rounded-[1.5rem] p-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
            <MessagesSquare className="h-3.5 w-3.5" />
            Discussion
          </div>
          <a
            href={discussionHref}
            className="mt-4 inline-flex rounded-full border border-[rgba(30,77,124,0.12)] bg-[rgba(30,77,124,0.05)] px-3.5 py-2 text-sm font-medium text-brand-primary transition-colors hover:border-brand-primary hover:bg-[rgba(30,77,124,0.08)]"
          >
            Jump to discussion
          </a>
        </div>
      )}

      {headings.length > 0 && (
        <div className="blog-shell-card rounded-[1.5rem] p-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
            <List className="h-3.5 w-3.5" />
            Jump Through The Article
          </div>
          <nav className="mt-4 space-y-2">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={cn(
                  'block rounded-xl px-3 py-2 text-sm leading-6 text-slate-600 transition-colors hover:bg-white hover:text-brand-primary',
                  heading.level === 3 && 'ml-4'
                )}
              >
                {heading.title}
              </a>
            ))}
          </nav>
        </div>
      )}

      {series && (
        <div className="blog-shell-card rounded-[1.5rem] p-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Series Progress
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-950">{series.name}</h3>
          <p className="mt-2 text-sm text-slate-600">
            Part {series.part} of {series.total}
          </p>
          {seriesHref && (
            <Link href={seriesHref} className="mt-4 inline-flex text-sm font-medium text-brand-primary hover:text-brand-primary-dark">
              View the full series
            </Link>
          )}
        </div>
      )}

      {(previous || next) && (
        <div className="blog-shell-card rounded-[1.5rem] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
            Keep Reading
          </div>
          <div className="mt-4 space-y-3">
            {previous && (
              <Link href={`/blog/${previous.slug}`} className="group flex items-start gap-3 rounded-xl border border-[rgba(148,163,184,0.18)] bg-white/75 px-3 py-3 transition-colors hover:border-brand-primary">
                <ArrowLeft className="mt-0.5 h-4 w-4 text-slate-400 transition-colors group-hover:text-brand-primary" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Previous</p>
                  <p className="mt-1 text-sm font-medium text-slate-700 group-hover:text-brand-primary">
                    {previous.title}
                  </p>
                </div>
              </Link>
            )}
            {next && (
              <Link href={`/blog/${next.slug}`} className="group flex items-start gap-3 rounded-xl border border-[rgba(148,163,184,0.18)] bg-white/75 px-3 py-3 transition-colors hover:border-brand-primary">
                <ArrowRight className="mt-0.5 h-4 w-4 text-slate-400 transition-colors group-hover:text-brand-primary" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Next</p>
                  <p className="mt-1 text-sm font-medium text-slate-700 group-hover:text-brand-primary">
                    {next.title}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
