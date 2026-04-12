import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  COMMENT_TARGET_COMPANY_ID,
  createPendingComment,
  getApprovedCommentsForArticle,
  normalizeCommentSlug,
} from '@/lib/comments/server'

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
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const articleTitle = typeof body.articleTitle === 'string' ? body.articleTitle.trim() : ''
  const bodyText = typeof body.bodyText === 'string' ? body.bodyText.trim() : ''
  const editorialItemId =
    typeof body.editorialItemId === 'string' && body.editorialItemId.trim()
      ? body.editorialItemId.trim()
      : null
  const parentCommentId = typeof body.parentCommentId === 'string' && body.parentCommentId.trim()
    ? body.parentCommentId.trim()
    : null

  if (!articleTitle) {
    return NextResponse.json({ error: 'Article title is required' }, { status: 400 })
  }

  if (bodyText.length < 1 || bodyText.length > 5000) {
    return NextResponse.json({ error: 'Comment text must be between 1 and 5000 characters' }, { status: 400 })
  }

  try {
    const result = await createPendingComment(supabase, user, {
      articleSlug: slug,
      articleTitle,
      editorialItemId,
      bodyText,
      parentCommentId,
    })

    return NextResponse.json({
      comment: result.comment,
      profile: result.profile,
      message: 'Comment submitted for moderation',
    }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit comment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
