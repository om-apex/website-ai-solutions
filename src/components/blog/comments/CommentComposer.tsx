'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, Send } from 'lucide-react'
import { CommentRequestError, submitArticleComment } from '@/lib/comments/client'
import { COMMENT_BODY_MAX_LENGTH } from '@/lib/comments/types'

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

  const formatRetryDelay = (retryAfterSeconds: number) => {
    if (retryAfterSeconds < 60) {
      return `${retryAfterSeconds} second${retryAfterSeconds === 1 ? '' : 's'}`
    }

    const minutes = Math.ceil(retryAfterSeconds / 60)
    return `${minutes} minute${minutes === 1 ? '' : 's'}`
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedBody = bodyText.trim()

    if (submitting) {
      return
    }

    if (!trimmedBody) {
      setError('Enter a comment before submitting it for review.')
      setNotice(null)
      return
    }

    if (trimmedBody.length > COMMENT_BODY_MAX_LENGTH) {
      setError(`Comments must be ${COMMENT_BODY_MAX_LENGTH} characters or fewer.`)
      setNotice(null)
      return
    }

    setSubmitting(true)
    setError(null)
    setNotice(null)

    try {
      const result = await submitArticleComment(articleSlug, {
        articleSlug,
        articleTitle,
        editorialItemId,
        bodyText: trimmedBody,
      })

      setBodyText('')
      setNotice(result.message)
      onSubmitted?.()
    } catch (submitError) {
      if (
        submitError instanceof CommentRequestError &&
        submitError.code === 'comment_rate_limited' &&
        typeof submitError.retryAfterSeconds === 'number'
      ) {
        setError(
          `You have reached the comment limit for now. Try again in ${formatRetryDelay(
            submitError.retryAfterSeconds
          )}.`
        )
      } else {
        setError(submitError instanceof Error ? submitError.message : 'Failed to submit comment')
      }
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
          maxLength={COMMENT_BODY_MAX_LENGTH}
          aria-invalid={Boolean(error)}
          className="w-full rounded-[1.2rem] border border-[rgba(148,163,184,0.18)] bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-inner outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-[rgba(30,77,124,0.08)] aria-[invalid=true]:border-rose-300 aria-[invalid=true]:focus:border-rose-400 aria-[invalid=true]:focus:ring-[rgba(225,29,72,0.12)]"
        />
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>Comments are reviewed before they appear publicly. Rapid repeat posting is throttled.</span>
          <span>{bodyText.length}/{COMMENT_BODY_MAX_LENGTH}</span>
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
