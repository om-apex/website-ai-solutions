import type { SupabaseClient, User } from '@supabase/supabase-js'
import type {
  CommentCreateInput,
  CommentModerationAction,
  CommentModerationEvent,
  CommentStatus,
  CommentUpdateProfileInput,
  CommenterIdentity,
  CommenterProfile,
  PublicComment,
} from './types'

export const COMMENT_TARGET_COMPANY_ID = 'om-ai-solutions'

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
    last_sign_in_provider: commentProfile.lastSignInProvider ?? existing?.lastSignInProvider ?? null,
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
  supabase: SupabaseClient,
  user: User,
  input: CommentCreateInput
) {
  const { data, error } = await supabase
    .from('blog_comments')
    .insert({
      target_company_id: COMMENT_TARGET_COMPANY_ID,
      article_slug: normalizeCommentSlug(input.articleSlug),
      article_title: input.articleTitle.trim(),
      auth_user_id: user.id,
      parent_comment_id: input.parentCommentId ?? null,
      author_display_name: getCommentDisplayName(user),
      author_avatar_url: getCommentAvatarUrl(user),
      body_text: input.bodyText.trim(),
      status: 'pending',
    })
    .select('*')
    .single()

  if (error) throw error
  return mapCommentRow(data as Record<string, unknown>)
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
