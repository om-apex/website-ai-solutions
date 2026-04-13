import { NextResponse } from 'next/server'
import { flagApprovedComment, CommentApiError } from '@/lib/comments/server'
import { createClient } from '@/lib/supabase/server'
import {
  COMMENT_FLAG_REASONS,
  COMMENT_REPORT_NOTE_MAX_LENGTH,
  type CommentApiErrorPayload,
  type CommentFlagReason,
} from '@/lib/comments/types'

function createCommentErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof CommentApiError) {
    const payload: CommentApiErrorPayload = {
      error: error.message,
      code: error.code,
    }

    if (typeof error.retryAfterSeconds === 'number') {
      payload.retryAfterSeconds = error.retryAfterSeconds
    }

    return NextResponse.json(payload, {
      status: error.status,
      headers:
        typeof error.retryAfterSeconds === 'number'
          ? { 'Retry-After': String(error.retryAfterSeconds) }
          : undefined,
    })
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'authentication_required' },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body', code: 'invalid_json' }, { status: 400 })
  }

  const commentId = typeof body.commentId === 'string' ? body.commentId.trim() : ''
  const reason = typeof body.reason === 'string' ? body.reason : ''
  const note = typeof body.note === 'string' ? body.note.trim() : null

  if (!commentId) {
    return NextResponse.json({ error: 'Comment ID is required', code: 'comment_not_found' }, { status: 400 })
  }

  if (!COMMENT_FLAG_REASONS.includes(reason as CommentFlagReason)) {
    return NextResponse.json(
      { error: 'Select a valid report reason', code: 'comment_not_reportable' },
      { status: 400 }
    )
  }

  if (note && note.length > COMMENT_REPORT_NOTE_MAX_LENGTH) {
    return NextResponse.json(
      {
        error: `Report details must be ${COMMENT_REPORT_NOTE_MAX_LENGTH} characters or fewer`,
        code: 'comment_not_reportable',
      },
      { status: 400 }
    )
  }

  try {
    const result = await flagApprovedComment(user, {
      commentId,
      reason: reason as CommentFlagReason,
      note,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return createCommentErrorResponse(error, 'Failed to submit report')
  }
}
