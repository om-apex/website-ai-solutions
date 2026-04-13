'use client'

import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle2, Loader2, LogIn, LogOut, Sparkles } from 'lucide-react'
import { useCommentAuth } from '@/contexts/CommentAuthContext'
import { getCommentProviderLabel } from '@/lib/comments/auth'

interface CommentAuthGateProps {
  children: ReactNode
}

export function CommentAuthGate({ children }: CommentAuthGateProps) {
  const { loading, authenticated, user, profile, signInWithGoogle, signInWithLinkedIn, signOut } =
    useCommentAuth()

  if (loading) {
    return (
      <div className="rounded-[1.45rem] border border-[rgba(148,163,184,0.16)] bg-white/80 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
          Checking your comment session...
        </div>
      </div>
    )
  }

  if (authenticated) {
    return (
      <div className="rounded-[1.45rem] border border-[rgba(148,163,184,0.16)] bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Ready to comment
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Signed in as <span className="font-medium text-slate-950">{profile?.displayName ?? user?.displayName}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(148,163,184,0.18)] bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    )
  }

  return (
    <div className="rounded-[1.45rem] border border-[rgba(148,163,184,0.16)] bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
        <LogIn className="h-3.5 w-3.5" />
        Sign in to comment
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Use Google or LinkedIn to join the discussion. Comments are reviewed before they appear publicly,
        and signed-in readers can report approved comments for moderator review.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
        >
          Continue with {getCommentProviderLabel('google')}
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => void signInWithLinkedIn()}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(148,163,184,0.18)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          Continue with {getCommentProviderLabel('linkedin')}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
        <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
        Your identity is used only for the comment profile and moderation flow.
      </p>
    </div>
  )
}
