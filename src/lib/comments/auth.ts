import type { SupabaseClient } from '@supabase/supabase-js'
import type { CommentAuthProvider } from './types'

export const COMMENT_AUTH_CALLBACK_PATH = '/api/comments/auth/callback'

const ALLOWED_HOSTS = new Set([
  'omapex.com',
  'www.omapex.com',
  'omaisolutions.com',
  'www.omaisolutions.com',
  'omsupplychain.com',
  'www.omsupplychain.com',
  'localhost',
  '127.0.0.1',
])

export function getSafeCommentRedirectTarget(redirect: string | null, fallbackOrigin: string) {
  if (!redirect) return `${fallbackOrigin}/`

  if (redirect.startsWith('/')) {
    return `${fallbackOrigin}${redirect}`
  }

  try {
    const target = new URL(redirect)
    const hostname = target.hostname.toLowerCase()
    const isAllowedHost = ALLOWED_HOSTS.has(hostname)
    const isVercelPreview = target.protocol === 'https:' && hostname.endsWith('.vercel.app')

    if (isAllowedHost || isVercelPreview) {
      return target.toString()
    }
  } catch {
    // Fall back to the current origin below.
  }

  return `${fallbackOrigin}/`
}

export function buildCommentAuthCallbackUrl(origin: string, redirectTarget: string) {
  return `${origin}${COMMENT_AUTH_CALLBACK_PATH}?redirect=${encodeURIComponent(redirectTarget)}`
}

export function getCommentProviderLabel(provider: CommentAuthProvider) {
  return provider === 'google' ? 'Google' : 'LinkedIn'
}

export async function startCommentOAuth(
  supabase: SupabaseClient,
  provider: CommentAuthProvider,
  currentUrl: string
) {
  const url = new URL(currentUrl)
  const redirectTarget = getSafeCommentRedirectTarget(url.toString(), url.origin)
  const redirectTo = buildCommentAuthCallbackUrl(url.origin, redirectTarget)

  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams: provider === 'google'
        ? { prompt: 'select_account' }
        : undefined,
    },
  })
}

