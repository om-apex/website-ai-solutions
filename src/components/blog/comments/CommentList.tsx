import type { PublicComment } from '@/lib/comments/types'
import { MessageSquareText, MessagesSquare } from 'lucide-react'

interface CommentListProps {
  comments: PublicComment[]
  loading?: boolean
  error?: string | null
}

export function CommentList({
  comments,
  loading = false,
  error = null,
}: CommentListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.35rem] border border-[rgba(148,163,184,0.16)] bg-white/80 p-4 shadow-[0_8px_26px_rgba(15,23,42,0.04)]"
          >
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {error}
      </div>
    )
  }

  if (!comments.length) {
    return (
      <div className="rounded-[1.35rem] border border-dashed border-[rgba(148,163,184,0.2)] bg-white/70 p-5 text-sm text-slate-600">
        <div className="inline-flex items-center gap-2 font-semibold text-brand-primary">
          <MessagesSquare className="h-4 w-4" />
          No approved comments yet
        </div>
        <p className="mt-2 leading-6">
          Be the first to add a perspective once the discussion opens up.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <article
          key={comment.id}
          className="rounded-[1.35rem] border border-[rgba(148,163,184,0.16)] bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
        >
          <header className="flex flex-wrap items-center gap-3">
            {comment.authorAvatarUrl ? (
              // Avatar image is optional and may be user-provided.
              // Using a plain img keeps the comment list lightweight.
              <img
                src={comment.authorAvatarUrl}
                alt={comment.authorDisplayName}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-[rgba(148,163,184,0.18)]"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(30,77,124,0.08)] text-sm font-semibold text-brand-primary">
                {comment.authorDisplayName.slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-950">
                {comment.authorDisplayName}
              </h3>
              <p className="text-xs text-slate-500">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>

            <span className="ml-auto rounded-full border border-[rgba(30,77,124,0.12)] bg-[rgba(30,77,124,0.04)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
              Approved
            </span>
          </header>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {comment.bodyText}
          </p>
        </article>
      ))}
    </div>
  )
}
