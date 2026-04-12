import Link from 'next/link'
import { MessagesSquare, ArrowDownRight } from 'lucide-react'

interface DiscussionCtaProps {
  articleTitle: string
  discussionHref?: string
}

export function DiscussionCta({
  articleTitle,
  discussionHref = '#discussion',
}: DiscussionCtaProps) {
  return (
    <section className="blog-shell-card mt-6 rounded-[1.45rem] border border-[rgba(30,77,124,0.1)] bg-gradient-to-r from-white via-white to-[rgba(30,77,124,0.03)] p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
            <MessagesSquare className="h-3.5 w-3.5" />
            Discussion
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
            Join the discussion on {articleTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Read the article, then share a point of view, a question, or a practical counterpoint below.
            Comments are reviewed before they appear publicly.
          </p>
        </div>

        <div className="flex shrink-0 items-start md:items-center">
          <Link
            href={discussionHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary-dark"
          >
            Jump to discussion
            <ArrowDownRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
