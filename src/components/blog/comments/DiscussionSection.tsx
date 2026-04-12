'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Loader2, MessagesSquare } from 'lucide-react'
import { CommentAuthGate } from './CommentAuthGate'
import { CommentComposer } from './CommentComposer'
import { CommentList } from './CommentList'
import { fetchArticleComments } from '@/lib/comments/client'
import type { PublicComment } from '@/lib/comments/types'

interface DiscussionSectionProps {
  articleSlug: string
  articleTitle: string
  editorialItemId?: string | null
}

export function DiscussionSection({
  articleSlug,
  articleTitle,
  editorialItemId = null,
}: DiscussionSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadComments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const payload = await fetchArticleComments(articleSlug)
      setComments(payload.comments)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load discussion')
    } finally {
      setLoading(false)
    }
  }, [articleSlug])

  useEffect(() => {
    void loadComments()
  }, [loadComments])

  return (
    <section id="discussion" className="mt-12 scroll-mt-28 rounded-[1.75rem] border border-[rgba(148,163,184,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,248,252,0.92))] p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
            <MessagesSquare className="h-3.5 w-3.5" />
            Discussion
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            Continue the conversation
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Use this section to challenge the argument, add a practical example, or ask a focused question
            about {articleTitle}.
          </p>
        </div>

        <div className="rounded-full border border-[rgba(30,77,124,0.12)] bg-white px-4 py-2 text-sm font-medium text-slate-600">
          {loading ? 'Loading comments...' : `${comments.length} approved comment${comments.length === 1 ? '' : 's'}`}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <CommentAuthGate>
          <CommentComposer
            articleSlug={articleSlug}
            articleTitle={articleTitle}
            editorialItemId={editorialItemId}
            onSubmitted={loadComments}
          />
        </CommentAuthGate>

        {error ? (
          <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <div className="inline-flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              Unable to load approved comments
            </div>
            <p className="mt-2 leading-6">{error}</p>
            <button
              type="button"
              onClick={() => void loadComments()}
              className="mt-3 inline-flex items-center rounded-full bg-rose-600 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-rose-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <CommentList comments={comments} loading={loading} />
        )}
      </div>
    </section>
  )
}
