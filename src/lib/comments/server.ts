import {
  createClient as createSupabaseClient,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js'
import type {
  CommentApiErrorCode,
  CommentCreateInput,
  CommentCreateResult,
  CommentFlagInput,
  CommentFlagReason,
  CommentFlagResult,
  CommentModerationAction,
  CommentStatus,
  CommentUpdateProfileInput,
  CommenterIdentity,
  CommenterProfile,
  PublicComment,
} from './types'
import {
  COMMENT_BODY_MAX_LENGTH,
  COMMENT_FLAG_REASONS,
  COMMENT_REPORT_NOTE_MAX_LENGTH,
} from './types'

export const COMMENT_TARGET_COMPANY_ID = 'om-ai-solutions'

const COMMENT_SUBMISSION_RATE_LIMIT_MAX = 3
const COMMENT_SUBMISSION_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const COMMENT_FLAG_RATE_LIMIT_MAX = 10
const COMMENT_FLAG_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const ALLOWED_COMMENT_AUTH_PROVIDERS = new Set(['google', 'linkedin'])

let commentAdminClient: SupabaseClient | null = null

export class CommentApiError extends Error {
  status: number
  code?: CommentApiErrorCode
  retryAfterSeconds?: number

  constructor(
    status: number,
    message: string,
    options?: { code?: CommentApiErrorCode; retryAfterSeconds?: number }
  ) {
    super(message)
    this.name = 'CommentApiError'
    this.status = status
    this.code = options?.code
    this.retryAfterSeconds = options?.retryAfterSeconds
  }
}

function getCommentAdminClient() {
  if (commentAdminClient) {
    return commentAdminClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Comment admin client is not configured')
  }

  commentAdminClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return commentAdminClient
}

function normalizeEmail(email: string | null | undefined) {
  return typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null
}

function getRetryAfterSeconds(createdAt: string | null | undefined, windowMs: number) {
  if (!createdAt) {
    return Math.ceil(windowMs / 1000)
  }

  const createdAtMs = Date.parse(createdAt)
  if (Number.isNaN(createdAtMs)) {
    return Math.ceil(windowMs / 1000)
  }

  return Math.max(1, Math.ceil((createdAtMs + windowMs - Date.now()) / 1000))
}

async function assertCommentRateLimit(
  supabase: SupabaseClient,
  input: {
    action: CommentModerationAction
    actorAuthUserId: string
    maxEvents: number
    windowMs: number
    message: string
    code: CommentApiErrorCode
  }
) {
  const cutoff = new Date(Date.now() - input.windowMs).toISOString()
  const { data, error } = await supabase
    .from('blog_comment_moderation_events')
    .select('created_at')
    .eq('actor_type', 'public_user')
    .eq('actor_auth_user_id', input.actorAuthUserId)
    .eq('action', input.action)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: true })
    .limit(input.maxEvents)

  if (error) {
    throw error
  }

  if ((data || []).length >= input.maxEvents) {
    throw new CommentApiError(429, input.message, {
      code: input.code,
      retryAfterSeconds: getRetryAfterSeconds(
        data?.[0] && typeof data[0].created_at === 'string' ? data[0].created_at : null,
        input.windowMs
      ),
    })
  }
}

async function validateAuthenticatedCommenter(user: User) {
  const provider = getCommentProvider(user)
  if (!provider || !ALLOWED_COMMENT_AUTH_PROVIDERS.has(provider)) {
    throw new CommentApiError(403, 'Sign in with Google or LinkedIn to comment.', {
      code: 'invalid_commenter',
    })
  }

  const normalizedEmail = normalizeEmail(user.email)
  if (!normalizedEmail) {
    throw new CommentApiError(403, 'A verified email address is required to comment.', {
      code: 'invalid_commenter',
    })
  }

  const profile = await upsertCommenterProfile(getCommentAdminClient(), user)
  if (profile.authUserId !== user.id) {
    throw new CommentApiError(403, 'Your comment profile could not be verified.', {
      code: 'invalid_commenter',
    })
  }

  if (normalizeEmail(profile.email) !== normalizedEmail) {
    throw new CommentApiError(403, 'Your comment profile email does not match this session.', {
      code: 'invalid_commenter',
    })
  }

  return {
    profile,
    provider,
  }
}

function buildCommentFlagNote(reason: CommentFlagReason, note: string | null) {
  const lines = [`Reason: ${reason}`]

  if (note) {
    lines.push(`Additional context: ${note}`)
  }

  return lines.join('\n')
}

export function normalizeCommentSlug(slug: string) {
  return slug.trim().replace(/^\/+|\/+$/g, '').toLowerCase()
}

export function getCommentDisplayName(user: User) {
  const metadata = user.user_metadata as Record<string, unknown> | undefined
  const candidate =
    (typeof metadata?.full_name === 'string' && metadata.full_name) ||
    (typeof metadata?.name === 'string' && metadata.name) ||
    (typeof user.email === 'string' ? user.email.split('@')[0] : '')

  return candidate.trim() || 'Commenter'
}

export function getCommentAvatarUrl(user: User) {
  const metadata = user.user_metadata as Record<string, unknown> | undefined
  return typeof metadata?.avatar_url === 'string' ? metadata.avatar_url : null
}

export function getCommentProvider(user: User) {
  const provider = user.app_metadata?.provider
  return typeof provider === 'string' ? provider : null
}

export function mapUserToCommentProfile(user: User): CommentUpdateProfileInput {
  return {
    displayName: getCommentDisplayName(user),
    avatarUrl: getCommentAvatarUrl(user),
    lastSignInProvider: getCommentProvider(user),
  }
}

export function mapCommentRow(row: Record<string, unknown>): PublicComment {
  return {
    id: String(row.id),
    targetCompanyId: String(row.target_company_id),
    articleSlug: String(row.article_slug),
    articleTitle: String(row.article_title),
    editorialItemId: row.editorial_item_id ? String(row.editorial_item_id) : null,
    authUserId: String(row.auth_user_id),
    parentCommentId: row.parent_comment_id ? String(row.parent_comment_id) : null,
    authorDisplayName: String(row.author_display_name),
    authorAvatarUrl: row.author_avatar_url ? String(row.author_avatar_url) : null,
    bodyText: String(row.body_text),
    status: row.status as CommentStatus,
    moderationReason: row.moderation_reason ? String(row.moderation_reason) : null,
    approvedAt: row.approved_at ? String(row.approved_at) : null,
    approvedBy: row.approved_by ? String(row.approved_by) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export function mapCommenterProfileRow(row: Record<string, unknown>): CommenterProfile {
  return {
    authUserId: String(row.auth_user_id),
    email: row.email ? String(row.email) : null,
    displayName: String(row.display_name),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    lastSignInProvider: row.last_sign_in_provider ? String(row.last_sign_in_provider) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export function mapCommenterIdentity(
  user: User,
  profile: CommenterProfile | null
): CommenterIdentity {
  return {
    authUserId: user.id,
    email: profile?.email ?? user.email ?? null,
    displayName: profile?.displayName ?? getCommentDisplayName(user),
    avatarUrl: profile?.avatarUrl ?? getCommentAvatarUrl(user),
    lastSignInProvider: profile?.lastSignInProvider ?? getCommentProvider(user),
  }
}

export async function getApprovedCommentsForArticle(
  supabase: SupabaseClient,
  articleSlug: string
) {
  const slug = normalizeCommentSlug(articleSlug)
  const { data, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('target_company_id', COMMENT_TARGET_COMPANY_ID)
    .eq('article_slug', slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data || []).map((row) => mapCommentRow(row as Record<string, unknown>))
}

export async function getCurrentCommenterProfile(
  supabase: SupabaseClient,
  authUserId: string
) {
  const { data, error } = await supabase
    .from('commenter_profiles')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (error) throw error
  return data ? mapCommenterProfileRow(data as Record<string, unknown>) : null
}

export async function upsertCommenterProfile(
  supabase: SupabaseClient,
  user: User
) {
  const existing = await getCurrentCommenterProfile(supabase, user.id)
  const commentProfile = mapUserToCommentProfile(user)
  const payload = {
    auth_user_id: user.id,
    email: user.email ?? existing?.email ?? null,
    display_name: commentProfile.displayName || existing?.displayName || 'Commenter',
    avatar_url: commentProfile.avatarUrl ?? existing?.avatarUrl ?? null,
    last_sign_in_provider:
      commentProfile.lastSignInProvider ?? existing?.lastSignInProvider ?? null,
  }

  const { data, error } = await supabase
    .from('commenter_profiles')
    .upsert(payload, { onConflict: 'auth_user_id' })
    .select('*')
    .single()

  if (error) throw error
  return mapCommenterProfileRow(data as Record<string, unknown>)
}

export async function updateCommenterProfile(
  supabase: SupabaseClient,
  authUserId: string,
  input: CommentUpdateProfileInput
) {
  const current = await getCurrentCommenterProfile(supabase, authUserId)
  if (!current) {
    throw new Error('Commenter profile not found')
  }

  const updatePayload: Record<string, unknown> = {}

  if (typeof input.displayName === 'string' && input.displayName.trim()) {
    updatePayload.display_name = input.displayName.trim()
  }
  if (typeof input.avatarUrl !== 'undefined') {
    updatePayload.avatar_url = input.avatarUrl ?? current.avatarUrl
  }
  if (typeof input.lastSignInProvider !== 'undefined') {
    updatePayload.last_sign_in_provider = input.lastSignInProvider ?? current.lastSignInProvider
  }

  const { data, error } = await supabase
    .from('commenter_profiles')
    .update(updatePayload)
    .eq('auth_user_id', authUserId)
    .select('*')
    .single()

  if (error) throw error
  return mapCommenterProfileRow(data as Record<string, unknown>)
}

export async function createPendingComment(
  user: User,
  input: CommentCreateInput
): Promise<CommentCreateResult> {
  const db = getCommentAdminClient()
  const { profile } = await validateAuthenticatedCommenter(user)
  const articleSlug = normalizeCommentSlug(input.articleSlug)
  const articleTitle = input.articleTitle.trim()
  const bodyText = input.bodyText.trim()

  if (!articleSlug) {
    throw new CommentApiError(400, 'Article slug is required.', {
      code: 'invalid_article_slug',
    })
  }

  if (!articleTitle) {
    throw new CommentApiError(400, 'Article title is required.', {
      code: 'invalid_article_title',
    })
  }

  if (!bodyText || bodyText.length > COMMENT_BODY_MAX_LENGTH) {
    throw new CommentApiError(
      400,
      `Comment text must be between 1 and ${COMMENT_BODY_MAX_LENGTH} characters.`,
      { code: 'invalid_comment_body' }
    )
  }

  await assertCommentRateLimit(db, {
    action: 'submitted',
    actorAuthUserId: user.id,
    maxEvents: COMMENT_SUBMISSION_RATE_LIMIT_MAX,
    windowMs: COMMENT_SUBMISSION_RATE_LIMIT_WINDOW_MS,
    message: 'You are posting comments too quickly. Please wait before trying again.',
    code: 'comment_rate_limited',
  })

  if (input.parentCommentId) {
    const { data: parentComment, error: parentError } = await db
      .from('blog_comments')
      .select('id, article_slug, parent_comment_id, status, target_company_id')
      .eq('id', input.parentCommentId)
      .maybeSingle()

    if (parentError) {
      throw parentError
    }

    if (
      !parentComment ||
      parentComment.target_company_id !== COMMENT_TARGET_COMPANY_ID ||
      parentComment.article_slug !== articleSlug
    ) {
      throw new CommentApiError(
        400,
        'Parent comment does not belong to this article.',
        { code: 'invalid_parent_comment' }
      )
    }

    if (parentComment.status !== 'approved') {
      throw new CommentApiError(
        400,
        'Replies are only allowed on approved comments.',
        { code: 'invalid_parent_comment' }
      )
    }

    if (parentComment.parent_comment_id) {
      throw new CommentApiError(
        400,
        'Replies can only go one level deep.',
        { code: 'reply_depth_exceeded' }
      )
    }
  }

  const { data, error } = await db
    .from('blog_comments')
    .insert({
      target_company_id: COMMENT_TARGET_COMPANY_ID,
      article_slug: articleSlug,
      article_title: articleTitle,
      editorial_item_id: input.editorialItemId ?? null,
      auth_user_id: user.id,
      parent_comment_id: input.parentCommentId ?? null,
      author_display_name: profile.displayName,
      author_avatar_url: profile.avatarUrl,
      body_text: bodyText,
      status: 'pending',
    })
    .select('*')
    .single()

  if (error) throw error
  const comment = mapCommentRow(data as Record<string, unknown>)

  await writeCommentModerationEvent(db, {
    commentId: comment.id,
    actorType: 'public_user',
    actorAuthUserId: user.id,
    actorEmail: user.email ?? null,
    action: 'submitted',
  })

  return {
    comment,
    profile,
    message: 'Submitted for moderation. Your comment will appear after review.',
  }
}

export async function flagApprovedComment(
  user: User,
  input: CommentFlagInput
): Promise<CommentFlagResult> {
  const db = getCommentAdminClient()
  await validateAuthenticatedCommenter(user)

  const commentId = input.commentId.trim()
  const note = typeof input.note === 'string' ? input.note.trim() : ''

  if (!commentId) {
    throw new CommentApiError(400, 'Comment ID is required.', {
      code: 'comment_not_found',
    })
  }

  if (!COMMENT_FLAG_REASONS.includes(input.reason)) {
    throw new CommentApiError(400, 'Select a valid report reason.', {
      code: 'comment_not_reportable',
    })
  }

  if (note.length > COMMENT_REPORT_NOTE_MAX_LENGTH) {
    throw new CommentApiError(
      400,
      `Report details must be ${COMMENT_REPORT_NOTE_MAX_LENGTH} characters or fewer.`,
      { code: 'comment_not_reportable' }
    )
  }

  const { data: commentRow, error: commentError } = await db
    .from('blog_comments')
    .select('auth_user_id, id, status, target_company_id')
    .eq('id', commentId)
    .maybeSingle()

  if (commentError) {
    throw commentError
  }

  if (!commentRow || commentRow.target_company_id !== COMMENT_TARGET_COMPANY_ID) {
    throw new CommentApiError(404, 'Comment not found.', {
      code: 'comment_not_found',
    })
  }

  if (commentRow.status !== 'approved') {
    throw new CommentApiError(400, 'Only approved comments can be reported.', {
      code: 'comment_not_reportable',
    })
  }

  if (commentRow.auth_user_id === user.id) {
    throw new CommentApiError(400, 'You cannot report your own comment.', {
      code: 'cannot_flag_own_comment',
    })
  }

  await assertCommentRateLimit(db, {
    action: 'flagged',
    actorAuthUserId: user.id,
    maxEvents: COMMENT_FLAG_RATE_LIMIT_MAX,
    windowMs: COMMENT_FLAG_RATE_LIMIT_WINDOW_MS,
    message: 'You have reached the report limit for now. Please try again later.',
    code: 'flag_rate_limited',
  })

  const { data: flagRow, error: flagError } = await db
    .from('blog_comment_flags')
    .insert({
      comment_id: commentId,
      reporter_auth_user_id: user.id,
      reason_code: input.reason,
      details: note || null,
    })
    .select('id')
    .single()

  if (flagError) {
    if (flagError.code === '23505') {
      throw new CommentApiError(409, 'You already reported this comment.', {
        code: 'comment_already_flagged',
      })
    }

    throw flagError
  }

  try {
    await writeCommentModerationEvent(db, {
      commentId,
      actorType: 'public_user',
      actorAuthUserId: user.id,
      actorEmail: user.email ?? null,
      action: 'flagged',
      note: buildCommentFlagNote(input.reason, note || null),
    })
  } catch (error) {
    await db.from('blog_comment_flags').delete().eq('id', String(flagRow.id))
    throw error
  }

  return {
    commentId,
    reason: input.reason,
    message: 'Report submitted. We will review this approved comment.',
  }
}

export async function writeCommentModerationEvent(
  supabase: SupabaseClient,
  input: {
    commentId: string
    actorType: 'public_user'
    actorAuthUserId: string
    actorEmail: string | null
    action: CommentModerationAction
    note?: string | null
  }
) {
  const { data, error } = await supabase
    .from('blog_comment_moderation_events')
    .insert({
      comment_id: input.commentId,
      actor_type: input.actorType,
      actor_auth_user_id: input.actorAuthUserId,
      actor_email: input.actorEmail,
      action: input.action,
      note: input.note ?? null,
    })
    .select('*')
    .single()

  if (error) throw error
  return data as Record<string, unknown>
}
