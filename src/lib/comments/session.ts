import type { CommenterSessionPayload } from './types'

export async function fetchCommenterSession(): Promise<CommenterSessionPayload> {
  const response = await fetch('/api/comments/session', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Comment session request failed: ${response.status}`)
  }

  return (await response.json()) as CommenterSessionPayload
}

