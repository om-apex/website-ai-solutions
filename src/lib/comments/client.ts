import type {
  ArticleCommentsPayload,
  CommentCreateInput,
  CommentCreateResult,
} from './types'

async function readJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : fallbackMessage
    throw new Error(message)
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
  input: CommentCreateInput,
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
