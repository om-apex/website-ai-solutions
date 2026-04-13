import type {
  ArticleCommentsPayload,
  CommentApiErrorCode,
  CommentCreateInput,
  CommentCreateResult,
  CommentFlagInput,
  CommentFlagResult,
} from './types'

export class CommentRequestError extends Error {
  status: number
  code?: CommentApiErrorCode
  retryAfterSeconds?: number

  constructor(
    message: string,
    options: {
      status: number
      code?: CommentApiErrorCode
      retryAfterSeconds?: number
    }
  ) {
    super(message)
    this.name = 'CommentRequestError'
    this.status = options.status
    this.code = options.code
    this.retryAfterSeconds = options.retryAfterSeconds
  }
}

async function readJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : fallbackMessage
    const code =
      payload &&
      typeof payload === 'object' &&
      'code' in payload &&
      typeof payload.code === 'string'
        ? (payload.code as CommentApiErrorCode)
        : undefined
    const retryAfterSeconds =
      payload &&
      typeof payload === 'object' &&
      'retryAfterSeconds' in payload &&
      typeof payload.retryAfterSeconds === 'number'
        ? payload.retryAfterSeconds
        : undefined

    throw new CommentRequestError(message, {
      status: response.status,
      code,
      retryAfterSeconds,
    })
  }

  return payload as T
}

export async function fetchArticleComments(slug: string): Promise<ArticleCommentsPayload> {
  const response = await fetch(`/api/comments/${encodeURIComponent(slug)}`, {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  return readJsonResponse<ArticleCommentsPayload>(response, 'Failed to load comments')
}

export async function submitArticleComment(
  slug: string,
  input: CommentCreateInput
): Promise<CommentCreateResult> {
  const response = await fetch(`/api/comments/${encodeURIComponent(slug)}`, {
    method: 'POST',
    cache: 'no-store',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  return readJsonResponse<CommentCreateResult>(response, 'Failed to submit comment')
}

export async function submitCommentFlag(input: CommentFlagInput): Promise<CommentFlagResult> {
  const response = await fetch('/api/comments/flags', {
    method: 'POST',
    cache: 'no-store',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  return readJsonResponse<CommentFlagResult>(response, 'Failed to submit report')
}
