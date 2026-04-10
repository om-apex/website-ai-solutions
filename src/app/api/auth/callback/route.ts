import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function getSafeRedirectTarget(redirect: string | null, fallbackOrigin: string) {
  if (!redirect) return `${fallbackOrigin}/`

  if (redirect.startsWith('/')) {
    return `${fallbackOrigin}${redirect}`
  }

  try {
    const target = new URL(redirect)
    const hostname = target.hostname.toLowerCase()
    const isKnownHost = new Set([
      'omapex.com',
      'www.omapex.com',
      'omaisolutions.com',
      'www.omaisolutions.com',
      'omsupplychain.com',
      'www.omsupplychain.com',
      'omluxeproperties.com',
      'www.omluxeproperties.com',
    ]).has(hostname)
    const isLocalHost = (hostname === 'localhost' || hostname === '127.0.0.1')
    const isVercelPreview = target.protocol === 'https:' && hostname.endsWith('.vercel.app')

    if (isKnownHost || isLocalHost || isVercelPreview) {
      return target.toString()
    }
  } catch {
    // Fall back to current origin below.
  }

  return `${fallbackOrigin}/`
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect')
  const safeRedirectTarget = getSafeRedirectTarget(redirect, origin)
  const safeErrorTarget = (() => {
    try {
      return new URL(safeRedirectTarget).origin
    } catch {
      return origin
    }
  })()

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user email is from omapex.com domain
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email && !user.email.endsWith('@omapex.com')) {
        // Sign out unauthorized users
        await supabase.auth.signOut()
        return NextResponse.redirect(`${safeErrorTarget}/?error=unauthorized`)
      }

      return NextResponse.redirect(safeRedirectTarget)
    }
  }

  // Return the user to the home page with an error
  return NextResponse.redirect(`${safeErrorTarget}/?error=auth_failed`)
}
