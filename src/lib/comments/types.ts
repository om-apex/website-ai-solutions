export type CommentAuthProvider = 'google' | 'linkedin'

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'

export const COMMENT_BODY_MAX_LENGTH = 5000

export const COMMENT_REPORT_NOTE_MAX_LENGTH = 500

export const COMMENT_FLAG_REASONS = [
  'spam',
  'abuse',
  'off_topic',
  'misinformation',
  'other',
] as const

export type CommentFlagReason = (typeof COMMENT_FLAG_REASONS)[number]

export type CommentModerationAction =
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'marked_spam'
  | 'restored'
  | 'flagged'

export type CommentApiErrorCode =
  | 'authentication_required'
  | 'invalid_commenter'
  | 'invalid_json'
  | 'invalid_article_slug'
  | 'invalid_article_title'
  | 'invalid_comment_body'
  | 'invalid_parent_comment'
  | 'reply_depth_exceeded'
  | 'comment_rate_limited'
  | 'comment_not_found'
  | 'comment_not_reportable'
  | 'cannot_flag_own_comment'
  | 'comment_already_flagged'
  | 'flag_rate_limited'

export interface CommenterProfile {
  authUserId: string
  email: string | null
  displayName: string
  avatarUrl: string | null
  lastSignInProvider: string | null
  createdAt: string
  updatedAt: string
}

export interface CommenterIdentity {
  authUserId: string
  email: string | null
  displayName: string
  avatarUrl: string | null
  lastSignInProvider: string | null
}

export interface PublicComment {
  id: string
  targetCompanyId: string
  articleSlug: string
  articleTitle: string
  editorialItemId: string | null
  authUserId: string
  parentCommentId: string | null
  authorDisplayName: string
  authorAvatarUrl: string | null
  bodyText: string
  status: CommentStatus
  moderationReason: string | null
  approvedAt: string | null
  approvedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface CommentModerationEvent {
  id: string
  commentId: string
  actorType: 'public_user' | 'owner' | 'system'
  actorAuthUserId: string | null
  actorEmail: string | null
  action: CommentModerationAction
  note: string | null
  createdAt: string
}

export interface CommenterSessionPayload {
  authenticated: boolean
  user: CommenterIdentity | null
  profile: CommenterProfile | null
}

export interface CommentProfilePayload {
  authenticated: boolean
  profile: CommenterProfile | null
}

export interface ArticleCommentsPayload {
  targetCompanyId: string
  articleSlug: string
  comments: PublicComment[]
}

export interface CommentCreateInput {
  articleSlug: string
  articleTitle: string
  editorialItemId?: string | null
  bodyText: string
  parentCommentId?: string | null
}

export interface CommentCreateResult {
  comment: PublicComment
  profile: CommenterProfile
  message: string
}

export interface CommentUpdateProfileInput {
  displayName?: string
  avatarUrl?: string | null
  lastSignInProvider?: string | null
}

export interface CommentFlagInput {
  commentId: string
  reason: CommentFlagReason
  note?: string | null
}

export interface CommentFlagResult {
  commentId: string
  reason: CommentFlagReason
  message: string
}

export interface CommentApiErrorPayload {
  error: string
  code?: CommentApiErrorCode
  retryAfterSeconds?: number
}
