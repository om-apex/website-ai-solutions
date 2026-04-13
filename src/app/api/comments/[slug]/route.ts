import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  COMMENT_TARGET_COMPANY_ID,
  CommentApiError,
  createPendingComment,
  getApprovedCommentsForArticle,
  normalizeCommentSlug,
} from '@/lib/comments/server'
import { COMMENT_BODY_MAX_LENGTH, type CommentApiErrorPayload } from '@/lib/comments/types'

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  try {
    const comments = await getApprovedCommentsForArticle(supabase, slug)
    return NextResponse.json(
      {
        targetCompanyId: COMMENT_TARGET_COMPANY_ID,
        articleSlug: normalizeCommentSlug(slug),
        comments,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load comments'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
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
    return NextResponse.json(
      { error: 'Invalid JSON body', code: 'invalid_json' },
      { status: 400 }
    )
  }

  const normalizedRouteSlug = normalizeCommentSlug(slug)
  const requestSlug =
    typeof body.articleSlug === 'string' ? normalizeCommentSlug(body.articleSlug) : normalizedRouteSlug
  const articleTitle = typeof body.articleTitle === 'string' ? body.articleTitle.trim() : ''
  const bodyText = typeof body.bodyText === 'string' ? body.bodyText.trim() : ''
  const editorialItemId =
    typeof body.editorialItemId === 'string' && body.editorialItemId.trim()
      ? body.editorialItemId.trim()
      : null
  const parentCommentId =
    typeof body.parentCommentId === 'string' && body.parentCommentId.trim()
      ? body.parentCommentId.trim()
      : null

  if (!normalizedRouteSlug) {
    return NextResponse.json(
      { error: 'Article slug is required', code: 'invalid_article_slug' },
      { status: 400 }
    )
  }

  if (requestSlug !== normalizedRouteSlug) {
    return NextResponse.json(
      { error: 'Request slug does not match the article route', code: 'invalid_article_slug' },
      { status: 400 }
    )
  }

  if (!articleTitle) {
    return NextResponse.json(
      { error: 'Article title is required', code: 'invalid_article_title' },
      { status: 400 }
    )
  }

  if (!bodyText || bodyText.length > COMMENT_BODY_MAX_LENGTH) {
    return NextResponse.json(
      {
        error: `Comment text must be between 1 and ${COMMENT_BODY_MAX_LENGTH} characters`,
        code: 'invalid_comment_body',
      },
      { status: 400 }
    )
  }

  try {
    const result = await createPendingComment(user, {
      articleSlug: normalizedRouteSlug,
      articleTitle,
      editorialItemId,
      bodyText,
      parentCommentId,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return createCommentErrorResponse(error, 'Failed to submit comment')
  }
}
