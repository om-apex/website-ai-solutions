'use client'

import { useState, type FormEvent } from 'react'
import {
  Flag,
  Loader2,
  MessageSquareText,
  MessagesSquare,
  ShieldAlert,
} from 'lucide-react'
import { useCommentAuth } from '@/contexts/CommentAuthContext'
import { CommentRequestError, submitCommentFlag } from '@/lib/comments/client'
import {
  COMMENT_FLAG_REASONS,
  COMMENT_REPORT_NOTE_MAX_LENGTH,
  type CommentFlagReason,
  type PublicComment,
} from '@/lib/comments/types'

interface CommentListProps {
  comments: PublicComment[]
  loading?: boolean
  error?: string | null
}

const REPORT_REASON_COPY: Record<CommentFlagReason, string> = {
  spam: 'Spam or promotional content',
  abuse: 'Abusive or harassing language',
  off_topic: 'Off-topic for this discussion',
  misinformation: 'Misleading or false claim',
  other: 'Something else worth moderator review',
}

function formatRetryDelay(retryAfterSeconds: number) {
  if (retryAfterSeconds < 60) {
    return `${retryAfterSeconds} second${retryAfterSeconds === 1 ? '' : 's'}`
  }

  const minutes = Math.ceil(retryAfterSeconds / 60)
  return `${minutes} minute${minutes === 1 ? '' : 's'}`
}

export function CommentList({
  comments,
  loading = false,
  error = null,
}: CommentListProps) {
  const { authenticated, user } = useCommentAuth()
  const [activeReportCommentId, setActiveReportCommentId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState<CommentFlagReason>('spam')
  const [reportNote, setReportNote] = useState('')
  const [reportPending, setReportPending] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)
  const [reportSuccessCommentId, setReportSuccessCommentId] = useState<string | null>(null)
  const [reportedCommentIds, setReportedCommentIds] = useState<string[]>([])

  const openReportForm = (commentId: string) => {
    setActiveReportCommentId(commentId)
    setReportReason('spam')
    setReportNote('')
    setReportError(null)
  }

  const closeReportForm = () => {
    if (reportPending) {
      return
    }

    setActiveReportCommentId(null)
    setReportReason('spam')
    setReportNote('')
    setReportError(null)
  }

  const handleReportSubmit = async (
    event: FormEvent<HTMLFormElement>,
    commentId: string
  ) => {
    event.preventDefault()

    if (reportPending) {
      return
    }

    const trimmedNote = reportNote.trim()
    if (trimmedNote.length > COMMENT_REPORT_NOTE_MAX_LENGTH) {
      setReportError(
        `Report details must be ${COMMENT_REPORT_NOTE_MAX_LENGTH} characters or fewer.`
      )
      return
    }

    setReportPending(true)
    setReportError(null)

    try {
      await submitCommentFlag({
        commentId,
        reason: reportReason,
        note: trimmedNote || null,
      })

      setReportedCommentIds((current) =>
        current.includes(commentId) ? current : [...current, commentId]
      )
      setReportSuccessCommentId(commentId)
      setActiveReportCommentId(null)
      setReportNote('')
      setReportReason('spam')
    } catch (submitError) {
      if (
        submitError instanceof CommentRequestError &&
        submitError.code === 'flag_rate_limited' &&
        typeof submitError.retryAfterSeconds === 'number'
      ) {
        setReportError(
          `You have reached the report limit for now. Try again in ${formatRetryDelay(
            submitError.retryAfterSeconds
          )}.`
        )
      } else {
        setReportError(
          submitError instanceof Error ? submitError.message : 'Failed to submit report'
        )
      }
    } finally {
      setReportPending(false)
    }
  }

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
      <div className="rounded-[1.15rem] border border-[rgba(148,163,184,0.14)] bg-white/75 px-4 py-3 text-xs leading-6 text-slate-600">
        {authenticated ? (
          <span className="inline-flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-brand-primary" />
            Signed-in readers can report approved comments for moderator review.
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <MessageSquareText className="h-3.5 w-3.5 text-brand-primary" />
            Sign in above if you need to report an approved comment.
          </span>
        )}
      </div>

      {comments.map((comment) => {
        const canReport = authenticated && user?.authUserId !== comment.authUserId
        const isReporting = activeReportCommentId === comment.id
        const isReported = reportedCommentIds.includes(comment.id)
        const showSuccess = reportSuccessCommentId === comment.id

        return (
          <article
            key={comment.id}
            className="rounded-[1.35rem] border border-[rgba(148,163,184,0.16)] bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
          >
            <header className="flex flex-wrap items-center gap-3">
              {comment.authorAvatarUrl ? (
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

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[rgba(30,77,124,0.12)] bg-[rgba(30,77,124,0.04)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
                  Approved
                </span>

                {canReport ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isReported) {
                        openReportForm(comment.id)
                      }
                    }}
                    disabled={isReported}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(148,163,184,0.18)] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 transition-colors hover:border-rose-200 hover:text-rose-700 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {isReported ? 'Reported' : 'Report'}
                  </button>
                ) : null}
              </div>
            </header>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {comment.bodyText}
            </p>

            {showSuccess ? (
              <div className="mt-4 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Report submitted. We will review this approved comment.
              </div>
            ) : null}

            {isReporting ? (
              <form
                onSubmit={(event) => {
                  void handleReportSubmit(event, comment.id)
                }}
                className="mt-4 space-y-3 rounded-[1.1rem] border border-[rgba(148,163,184,0.18)] bg-[rgba(248,250,252,0.8)] p-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor={`comment-report-reason-${comment.id}`}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
                  >
                    Why are you reporting this?
                  </label>
                  <select
                    id={`comment-report-reason-${comment.id}`}
                    value={reportReason}
                    onChange={(event) => setReportReason(event.target.value as CommentFlagReason)}
                    className="w-full rounded-[0.95rem] border border-[rgba(148,163,184,0.18)] bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-[rgba(30,77,124,0.08)]"
                  >
                    {COMMENT_FLAG_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {REPORT_REASON_COPY[reason]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`comment-report-note-${comment.id}`}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
                  >
                    Additional context
                  </label>
                  <textarea
                    id={`comment-report-note-${comment.id}`}
                    value={reportNote}
                    onChange={(event) => setReportNote(event.target.value)}
                    maxLength={COMMENT_REPORT_NOTE_MAX_LENGTH}
                    rows={3}
                    placeholder="Optional detail to help moderators review this report."
                    className="w-full rounded-[0.95rem] border border-[rgba(148,163,184,0.18)] bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-[rgba(30,77,124,0.08)]"
                  />
                  <div className="text-right text-[11px] text-slate-500">
                    {reportNote.length}/{COMMENT_REPORT_NOTE_MAX_LENGTH}
                  </div>
                </div>

                {reportError ? (
                  <div className="rounded-[0.95rem] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {reportError}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs leading-5 text-slate-500">
                    Reports are visible to moderators only and do not publish publicly.
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={closeReportForm}
                      disabled={reportPending}
                      className="inline-flex items-center rounded-full border border-[rgba(148,163,184,0.18)] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={reportPending}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {reportPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          <Flag className="h-3.5 w-3.5" />
                          Submit report
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
