export type CommentAuthProvider = 'google' | 'linkedin'

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'

export type CommentModerationAction =
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'marked_spam'
  | 'restored'
  | 'flagged'

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
}

export interface CommentUpdateProfileInput {
  displayName?: string
  avatarUrl?: string | null
  lastSignInProvider?: string | null
}
