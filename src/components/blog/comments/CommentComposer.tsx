'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, Send } from 'lucide-react'
import { submitArticleComment } from '@/lib/comments/client'

interface CommentComposerProps {
  articleSlug: string
  articleTitle: string
  editorialItemId?: string | null
  onSubmitted?: () => void
}

export function CommentComposer({
  articleSlug,
  articleTitle,
  editorialItemId = null,
  onSubmitted,
}: CommentComposerProps) {
  const [bodyText, setBodyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedBody = bodyText.trim()

    if (!trimmedBody || submitting) {
      return
    }

    setSubmitting(true)
    setError(null)
    setNotice(null)

    try {
      await submitArticleComment(articleSlug, {
        articleSlug,
        articleTitle,
        editorialItemId,
        bodyText: trimmedBody,
      })

      setBodyText('')
      setNotice('Submitted for moderation. Your comment will appear after review.')
      onSubmitted?.()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor={`comment-body-${articleSlug}`} className="text-sm font-medium text-slate-700">
          Your comment
        </label>
        <textarea
          id={`comment-body-${articleSlug}`}
          value={bodyText}
          onChange={(event) => setBodyText(event.target.value)}
          placeholder="Share a perspective, question, or practical counterpoint."
          rows={6}
          maxLength={5000}
          className="w-full rounded-[1.2rem] border border-[rgba(148,163,184,0.18)] bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-inner outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-[rgba(30,77,124,0.08)]"
        />
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>Comments are reviewed before they appear publicly.</span>
          <span>{bodyText.length}/5000</span>
        </div>
      </div>

      {notice && (
        <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs leading-5 text-slate-500">
          Your comment stays in pending review until it is approved by the site owner.
        </p>

        <button
          type="submit"
          disabled={!bodyText.trim() || submitting}
          className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting
            </>
          ) : (
            <>
              Submit for review
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
